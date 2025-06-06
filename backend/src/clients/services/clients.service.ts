import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Client } from '../entities/client.entity';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async findAll(companyId: string, search?: string) {
    const queryBuilder = this.clientsRepository.createQueryBuilder('client')
      .leftJoinAndSelect('client.processes', 'processes')
      .where('client.companyId = :companyId', { companyId });

    if (search) {
      queryBuilder.andWhere(
        '(client.name ILIKE :search OR client.email ILIKE :search OR client.phone ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, companyId: string) {
    const client = await this.clientsRepository.findOne({
      where: { id, company: { id: companyId } },
      relations: ['processes'],
    });
    
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    
    return client;
  }

  async create(createClientDto: CreateClientDto, companyId: string) {
    const client = this.clientsRepository.create({
      ...createClientDto,
      company: { id: companyId },
    });
    return this.clientsRepository.save(client);
  }

  async update(id: string, updateClientDto: UpdateClientDto, companyId: string) {
    const client = await this.findOne(id, companyId);
    Object.assign(client, updateClientDto);
    return this.clientsRepository.save(client);
  }

  async remove(id: string, companyId: string) {
    const client = await this.findOne(id, companyId);
    return this.clientsRepository.remove(client);
  }
}