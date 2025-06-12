import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ContractStatus } from '../entities/contract.entity';
import { ContractValue } from '../entities/contract-value.entity';
import { ContractHistory } from '../entities/contract-history.entity';
import { ContractDocument } from '../entities/contract-document.entity';
import { CreateContractDto } from '../dto/create-contract.dto';
import { UpdateContractDto } from '../dto/update-contract.dto';
import { CreateContractValueDto } from '../dto/create-contract-value.dto';
import { UpdateContractValueDto } from '../dto/update-contract-value.dto';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    @InjectRepository(ContractValue)
    private contractValuesRepository: Repository<ContractValue>,
    @InjectRepository(ContractHistory)
    private contractHistoryRepository: Repository<ContractHistory>,
    @InjectRepository(ContractDocument)
    private contractDocumentsRepository: Repository<ContractDocument>,
  ) {}

  async findAll(companyId: string, filters?: { clientId?: string; status?: string; contractType?: string }) {
    const query = this.contractsRepository.createQueryBuilder('contract')
      .leftJoinAndSelect('contract.client', 'client')
      .leftJoinAndSelect('contract.process', 'process')
      .leftJoinAndSelect('contract.createdBy', 'createdBy')
      .leftJoinAndSelect('contract.values', 'values')
      .where('contract.companyId = :companyId', { companyId })
      .orderBy('contract.createdAt', 'DESC');

    if (filters?.clientId) {
      query.andWhere('client.id = :clientId', { clientId: filters.clientId });
    }
    if (filters?.status) {
      query.andWhere('contract.status = :status', { status: filters.status });
    }
    if (filters?.contractType) {
      query.andWhere('contract.contractType = :contractType', { contractType: filters.contractType });
    }

    return query.getMany();
  }

  async findOne(id: string, companyId: string) {
    const contract = await this.contractsRepository.findOne({
      where: { id, company: { id: companyId } },
      relations: [
        'client', 
        'process', 
        'createdBy', 
        'values', 
        'history', 
        'history.createdBy',
        'documents',
        'documents.uploadedBy'
      ],
      order: {
        history: { createdAt: 'DESC' },
        documents: { uploadedAt: 'DESC' },
        values: { createdAt: 'ASC' }
      }
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    return contract;
  }

  async create(createContractDto: CreateContractDto, companyId: string) {
    const contractNumber = await this.generateContractNumber(companyId);

    const contract = this.contractsRepository.create({
      ...createContractDto,
      contractNumber,
      client: { id: createContractDto.clientId },
      process: createContractDto.processId ? { id: createContractDto.processId } : null,
      company: { id: companyId },
      createdBy: { id: createContractDto.createdBy },
      startDate: new Date(createContractDto.startDate),
      endDate: createContractDto.endDate ? new Date(createContractDto.endDate) : null,
    });

    const savedContract = await this.contractsRepository.save(contract);

    await this.createHistoryEntry(
      savedContract.id,
      'contract_created',
      'Contract was created',
      null,
      { status: savedContract.status, totalValue: savedContract.totalValue },
      createContractDto.createdBy
    );

    return this.findOne(savedContract.id, companyId);
  }

  async update(id: string, updateContractDto: UpdateContractDto, companyId: string, userId: string) {
    const contract = await this.findOne(id, companyId);
    const oldValues = { ...contract };

    Object.assign(contract, {
      ...updateContractDto,
      client: updateContractDto.clientId ? { id: updateContractDto.clientId } : contract.client,
      process: updateContractDto.processId ? { id: updateContractDto.processId } : contract.process,
      startDate: updateContractDto.startDate ? new Date(updateContractDto.startDate) : contract.startDate,
      endDate: updateContractDto.endDate ? new Date(updateContractDto.endDate) : contract.endDate,
    });

    const savedContract = await this.contractsRepository.save(contract);

    await this.createHistoryEntry(
      id,
      'contract_updated',
      'Contract was updated',
      { status: oldValues.status, totalValue: oldValues.totalValue },
      { status: savedContract.status, totalValue: savedContract.totalValue },
      userId
    );

    return this.findOne(id, companyId);
  }

  async remove(id: string, companyId: string, userId: string) {
    const contract = await this.findOne(id, companyId);

    await this.createHistoryEntry(
      id,
      'contract_deleted',
      'Contract was deleted',
      { status: contract.status },
      null,
      userId
    );

    return this.contractsRepository.remove(contract);
  }

  async addValue(contractId: string, createValueDto: CreateContractValueDto, companyId: string, userId: string) {
    const contract = await this.findOne(contractId, companyId);

    const value = this.contractValuesRepository.create({
      ...createValueDto,
      contract: { id: contractId },
      dueDate: createValueDto.dueDate ? new Date(createValueDto.dueDate) : null,
    });

    const savedValue = await this.contractValuesRepository.save(value);

    await this.createHistoryEntry(
      contractId,
      'value_added',
      `Payment entry added: ${createValueDto.description} - $${createValueDto.amount}`,
      null,
      { amount: createValueDto.amount, description: createValueDto.description },
      userId
    );

    return savedValue;
  }

  async updateValue(valueId: string, updateValueDto: UpdateContractValueDto, companyId: string, userId: string) {
    const value = await this.contractValuesRepository.findOne({
      where: { id: valueId, contract: { company: { id: companyId } } },
      relations: ['contract']
    });

    if (!value) {
      throw new NotFoundException(`Contract value with ID ${valueId} not found`);
    }

    const oldValues = { ...value };
    Object.assign(value, {
      ...updateValueDto,
      dueDate: updateValueDto.dueDate ? new Date(updateValueDto.dueDate) : value.dueDate,
    });

    const savedValue = await this.contractValuesRepository.save(value);

    await this.createHistoryEntry(
      value.contract.id,
      'value_updated',
      `Payment entry updated: ${savedValue.description}`,
      { amount: oldValues.amount, status: oldValues.status },
      { amount: savedValue.amount, status: savedValue.status },
      userId
    );

    return savedValue;
  }

  async removeValue(valueId: string, companyId: string, userId: string) {
    const value = await this.contractValuesRepository.findOne({
      where: { id: valueId, contract: { company: { id: companyId } } },
      relations: ['contract']
    });

    if (!value) {
      throw new NotFoundException(`Contract value with ID ${valueId} not found`);
    }

    await this.createHistoryEntry(
      value.contract.id,
      'value_removed',
      `Payment entry removed: ${value.description} - $${value.amount}`,
      { amount: value.amount, description: value.description },
      null,
      userId
    );

    return this.contractValuesRepository.remove(value);
  }

  async getContractDocuments(contractId: string, companyId: string) {
    const contract = await this.findOne(contractId, companyId);
    return this.contractDocumentsRepository.find({
      where: { contract: { id: contractId } },
      relations: ['uploadedBy'],
      order: { uploadedAt: 'DESC' }
    });
  }

  async addDocument(contractId: string, documentData: any, companyId: string, userId: string) {
    const contract = await this.findOne(contractId, companyId);

    const document = this.contractDocumentsRepository.create({
      ...documentData,
      contract: { id: contractId },
      uploadedBy: { id: userId },
      uploadedAt: new Date(),
    });

    const savedDocument = await this.contractDocumentsRepository.save(document);

    await this.createHistoryEntry(
      contractId,
      'document_added',
      `Document uploaded: ${documentData.name}`,
      null,
      { documentName: documentData.name, documentType: documentData.documentType },
      userId
    );

    return savedDocument;
  }

  async removeDocument(documentId: string, companyId: string, userId: string) {
    const document = await this.contractDocumentsRepository.findOne({
      where: { id: documentId, contract: { company: { id: companyId } } },
      relations: ['contract']
    });

    if (!document) {
      throw new NotFoundException(`Contract document with ID ${documentId} not found`);
    }

    await this.createHistoryEntry(
      document.contract.id,
      'document_removed',
      `Document removed: ${document.name}`,
      { documentName: document.name },
      null,
      userId
    );

    return this.contractDocumentsRepository.remove(document);
  }

  private async generateContractNumber(companyId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.contractsRepository.count({
      where: { company: { id: companyId } }
    });
    return `CTR-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  private async createHistoryEntry(
    contractId: string,
    action: string,
    description: string,
    oldValues: any,
    newValues: any,
    userId: string
  ) {
    const history = this.contractHistoryRepository.create({
      contract: { id: contractId },
      action,
      description,
      oldValues,
      newValues,
      createdBy: { id: userId },
    });

    return this.contractHistoryRepository.save(history);
  }

  async getContractStats(companyId: string) {
    const totalContracts = await this.contractsRepository.count({
      where: { company: { id: companyId } }
    });

    const activeContracts = await this.contractsRepository.count({
      where: { company: { id: companyId }, status: ContractStatus.ACTIVE } // Fixed: Use enum value
    });

    const totalValue = await this.contractsRepository
      .createQueryBuilder('contract')
      .select('SUM(contract.totalValue)', 'total')
      .where('contract.companyId = :companyId', { companyId })
      .andWhere('contract.status IN (:...statuses)', { statuses: [ContractStatus.ACTIVE, ContractStatus.COMPLETED] }) // Fixed: Use enum values
      .getRawOne();

    const pendingPayments = await this.contractValuesRepository
      .createQueryBuilder('value')
      .select('SUM(value.amount)', 'total')
      .leftJoin('value.contract', 'contract')
      .where('contract.companyId = :companyId', { companyId })
      .andWhere('value.status = :status', { status: 'pending' })
      .getRawOne();

    return {
      totalContracts,
      activeContracts,
      totalValue: parseFloat(totalValue?.total || '0'),
      pendingPayments: parseFloat(pendingPayments?.total || '0'),
    };
  }
}