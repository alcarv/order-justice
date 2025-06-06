import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import { ClientService, ClientServiceStatus } from '../entities/client-service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { StartServiceDto } from '../dto/start-service.dto';
import { UpdateServiceStatusDto } from '../dto/update-service-status.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(ClientService)
    private clientServicesRepository: Repository<ClientService>,
  ) {}

  async findAll(companyId: string) {
    return this.servicesRepository.find({
      where: { company: { id: companyId } },
      order: { title: 'ASC' },
    });
  }

  async findOne(id: string, companyId: string) {
    const service = await this.servicesRepository.findOne({
      where: { id, company: { id: companyId } },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async create(createServiceDto: CreateServiceDto, companyId: string) {
    const service = this.servicesRepository.create({
      ...createServiceDto,
      company: { id: companyId },
    });
    return this.servicesRepository.save(service);
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, companyId: string) {
    const service = await this.findOne(id, companyId);
    Object.assign(service, updateServiceDto);
    return this.servicesRepository.save(service);
  }

  async remove(id: string, companyId: string) {
    const service = await this.findOne(id, companyId);
    return this.servicesRepository.remove(service);
  }

  async startService(startServiceDto: StartServiceDto, companyId: string) {
    await this.findOne(startServiceDto.serviceId, companyId);
    
    const clientService = this.clientServicesRepository.create({
      client: { id: startServiceDto.clientId },
      service: { id: startServiceDto.serviceId },
      assignedTo: { id: startServiceDto.assignedTo },
      status: ClientServiceStatus.PENDING,
      startedAt: new Date(),
    });
    
    const savedService = await this.clientServicesRepository.save(clientService);
    
    return this.clientServicesRepository.findOne({
      where: { id: savedService.id },
      relations: ['service', 'client', 'assignedTo'],
    });
  }

  async getClientServices(clientId: string, companyId: string) {
    return this.clientServicesRepository.find({
      where: { 
        client: { id: clientId, company: { id: companyId } }
      },
      relations: ['service', 'assignedTo'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, updateStatusDto: UpdateServiceStatusDto, companyId: string) {
    const clientService = await this.clientServicesRepository.findOne({
      where: { 
        id,
        client: { company: { id: companyId } }
      },
      relations: ['client', 'service'],
    });
    
    if (!clientService) {
      throw new NotFoundException(`Client service with ID ${id} not found`);
    }

    clientService.status = updateStatusDto.status;
    if (updateStatusDto.status === ClientServiceStatus.COMPLETED) {
      clientService.completedAt = new Date();
    }

    const savedService = await this.clientServicesRepository.save(clientService);
    
    return this.clientServicesRepository.findOne({
      where: { id: savedService.id },
      relations: ['service', 'client', 'assignedTo'],
    });
  }

  async deleteClientService(id: string, companyId: string) {
    const clientService = await this.clientServicesRepository.findOne({
      where: { 
        id,
        client: { company: { id: companyId } }
      },
      relations: ['client'],
    });
    
    if (!clientService) {
      throw new NotFoundException(`Client service with ID ${id} not found`);
    }

    return this.clientServicesRepository.remove(clientService);
  }
}