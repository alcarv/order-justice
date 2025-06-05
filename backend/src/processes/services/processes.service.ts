import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Process } from '../entities/process.entity';
import { Activity } from '../entities/activity.entity';
import { CreateProcessDto } from '../dto/create-process.dto';
import { UpdateProcessDto } from '../dto/update-process.dto';
import { AddActivityDto, ActivityType } from '../dto/add-activity.dto';

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(Process)
    private processesRepository: Repository<Process>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async findAll(filters: { clientId?: string; status?: string; priority?: string }) {
    const query = this.processesRepository.createQueryBuilder('process')
      .leftJoinAndSelect('process.client', 'client')
      .leftJoinAndSelect('process.assignedTo', 'assignedTo')
      .leftJoinAndSelect('process.activities', 'activities')
      .orderBy('process.updatedAt', 'DESC');

    if (filters.clientId) {
      query.andWhere('client.id = :clientId', { clientId: filters.clientId });
    }
    if (filters.status) {
      query.andWhere('process.status = :status', { status: filters.status });
    }
    if (filters.priority) {
      query.andWhere('process.priority = :priority', { priority: filters.priority });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const process = await this.processesRepository.findOne({
      where: { id },
      relations: ['client', 'assignedTo', 'activities', 'documents'],
    });

    if (!process) {
      throw new NotFoundException(`Process with ID ${id} not found`);
    }

    return process;
  }

  async create(createProcessDto: CreateProcessDto) {
    const process = this.processesRepository.create({
      ...createProcessDto,
      client: { id: createProcessDto.clientId },
      assignedTo: createProcessDto.assignedTo.map(id => ({ id })),
      createdBy: { id: createProcessDto.createdBy },
    });

    const savedProcess = await this.processesRepository.save(process);

    // Create initial activity
    const activity = this.activityRepository.create({
      process: savedProcess,
      type: ActivityType.STATUS_CHANGE,
      description: `Process created with status ${createProcessDto.status}`,
      createdBy: { id: createProcessDto.createdBy },
    });

    await this.activityRepository.save(activity);

    return this.findOne(savedProcess.id);
  }

  async update(id: string, updateProcessDto: UpdateProcessDto) {
    const process = await this.findOne(id);
    
    if (updateProcessDto.clientId) {
      process.client = { id: updateProcessDto.clientId } as any;
    }
    if (updateProcessDto.assignedTo) {
      process.assignedTo = updateProcessDto.assignedTo.map(id => ({ id } as any));
    }

    Object.assign(process, updateProcessDto);
    return this.processesRepository.save(process);
  }

  async remove(id: string) {
    const process = await this.findOne(id);
    return this.processesRepository.remove(process);
  }

  async addActivity(id: string, addActivityDto: AddActivityDto) {
    const process = await this.findOne(id);
    
    const activity = this.activityRepository.create({
      process,
      ...addActivityDto,
      createdBy: process.createdBy,
    });

    await this.activityRepository.save(activity);
    return this.findOne(id);
  }

  async getActivities(id: string) {
    const process = await this.findOne(id);
    return process.activities;
  }
}
