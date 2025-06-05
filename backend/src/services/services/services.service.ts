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

  async findAll() {
    return this.servicesRepository.find();
  }

  async findOne(id: string) {
    const service = await this.servicesRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async create(createServiceDto: CreateServiceDto) {
    const service = this.servicesRepository.create(createServiceDto);
    return this.servicesRepository.save(service);
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.findOne(id);
    Object.assign(service, updateServiceDto);
    return this.servicesRepository.save(service);
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    return this.servicesRepository.remove(service);
  }

  async startService(startServiceDto: StartServiceDto) {
    const clientService = this.clientServicesRepository.create({
      client: { id: startServiceDto.clientId },
      service: { id: startServiceDto.serviceId },
      assignedTo: { id: startServiceDto.assignedTo },
      status: ClientServiceStatus.PENDING,
      startedAt: new Date(),
    });
    return this.clientServicesRepository.save(clientService);
  }

  async getClientServices(clientId: string) {
    return this.clientServicesRepository.find({
      where: { client: { id: clientId } },
      relations: ['service'],
    });
  }

  async updateStatus(id: string, updateStatusDto: UpdateServiceStatusDto) {
    const clientService = await this.clientServicesRepository.findOne({ where: { id } });
    if (!clientService) {
      throw new NotFoundException(`Client service with ID ${id} not found`);
    }

    clientService.status = updateStatusDto.status;
    if (updateStatusDto.status === ClientServiceStatus.COMPLETED) {
      clientService.completedAt = new Date();
    }

    return this.clientServicesRepository.save(clientService);
  }
}
