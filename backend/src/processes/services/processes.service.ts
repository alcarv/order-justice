import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Process } from '../entities/process.entity';
import { Activity } from '../entities/activity.entity';
import { CreateProcessDto } from '../dto/create-process.dto';
import { UpdateProcessDto } from '../dto/update-process.dto';
import { AddActivityDto } from '../dto/add-activity.dto';

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(Process)
    private processesRepository: Repository<Process>,
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
  ) {}

  async findAll(companyId: string, filters: { clientId?: string; status?: string; priority?: string }) {
    const query = this.processesRepository.createQueryBuilder('process')
      .leftJoinAndSelect('process.client', 'client')
      .leftJoinAndSelect('process.assignedTo', 'assignedTo')
      .leftJoinAndSelect('process.activities', 'activities')
      .where('process.companyId = :companyId', { companyId })
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

  async findOne(id: string, companyId: string) {
    const process = await this.processesRepository.findOne({
      where: { id, company: { id: companyId } },
      relations: ['client', 'assignedTo', 'activities', 'documents'],
    });

    if (!process) {
      throw new NotFoundException(`Process with ID ${id} not found`);
    }

    return process;
  }

  async create(createProcessDto: CreateProcessDto, companyId: string) {
    const processData = {
      title: createProcessDto.title,
      description: createProcessDto.description,
      status: createProcessDto.status,
      priority: createProcessDto.priority,
      dueDate: createProcessDto.dueDate ? new Date(createProcessDto.dueDate) : undefined,
      court: createProcessDto.court,
      caseNumber: createProcessDto.caseNumber,
      client: { id: createProcessDto.clientId },
      createdBy: { id: createProcessDto.createdBy },
      company: { id: companyId },
    };

    const process = this.processesRepository.create(processData);
    const savedProcess = await this.processesRepository.save(process);

    if (createProcessDto.assignedTo && createProcessDto.assignedTo.length > 0) {
      await this.processesRepository
        .createQueryBuilder()
        .relation(Process, 'assignedTo')
        .of(savedProcess.id)
        .add(createProcessDto.assignedTo);
    }

    return this.findOne(savedProcess.id, companyId);
  }

  async update(id: string, updateProcessDto: UpdateProcessDto, companyId: string) {
    const process = await this.findOne(id, companyId);
    
    const updateData = {
      title: updateProcessDto.title,
      description: updateProcessDto.description,
      status: updateProcessDto.status,
      priority: updateProcessDto.priority,
      dueDate: updateProcessDto.dueDate ? new Date(updateProcessDto.dueDate) : undefined,
      court: updateProcessDto.court,
      caseNumber: updateProcessDto.caseNumber,
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await this.processesRepository.update(id, updateData);

    if (updateProcessDto.assignedTo !== undefined) {
      await this.processesRepository
        .createQueryBuilder()
        .relation(Process, 'assignedTo')
        .of(id)
        .remove(process.assignedTo.map(user => user.id));

      if (updateProcessDto.assignedTo.length > 0) {
        await this.processesRepository
          .createQueryBuilder()
          .relation(Process, 'assignedTo')
          .of(id)
          .add(updateProcessDto.assignedTo);
      }
    }

    if (updateProcessDto.clientId) {
      await this.processesRepository.update(id, {
        client: { id: updateProcessDto.clientId }
      });
    }

    return this.findOne(id, companyId);
  }

  async remove(id: string, companyId: string) {
    const process = await this.findOne(id, companyId);
    return this.processesRepository.remove(process);
  }

  async addActivity(id: string, addActivityDto: AddActivityDto, companyId: string, userId: string) {
    const process = await this.findOne(id, companyId);
    
    const activity = this.activitiesRepository.create({
      type: addActivityDto.type,
      description: addActivityDto.description,
      process: { id: process.id },
      createdBy: { id: userId },
    });

    const savedActivity = await this.activitiesRepository.save(activity);
    
    return this.findOne(id, companyId);
  }

  async getActivities(id: string, companyId: string) {
    const process = await this.findOne(id, companyId);
    return this.activitiesRepository.find({
      where: { process: { id: process.id } },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }
}