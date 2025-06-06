import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientFact } from '../entities/client-fact.entity';
import { CreateFactDto } from '../dto/create-fact.dto';
import { UpdateFactDto } from '../dto/update-fact.dto';
import { LinkProcessDto } from '../dto/link-process.dto';

@Injectable()
export class FactsService {
  constructor(
    @InjectRepository(ClientFact)
    private factsRepository: Repository<ClientFact>,
  ) {}

  async findByClient(clientId: string, companyId: string) {
    return this.factsRepository.find({
      where: { 
        client: { id: clientId, company: { id: companyId } }
      },
      relations: ['client', 'reportedBy', 'process'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createFactDto: CreateFactDto, companyId: string) {
    // Verify client belongs to company
    const fact = this.factsRepository.create({
      ...createFactDto,
      client: { id: createFactDto.clientId },
      reportedBy: { id: createFactDto.reportedBy },
      process: createFactDto.processId ? { id: createFactDto.processId } : null,
    });
    return this.factsRepository.save(fact);
  }

  async update(id: string, updateFactDto: UpdateFactDto, companyId: string) {
    const fact = await this.factsRepository.findOne({
      where: { 
        id,
        client: { company: { id: companyId } }
      },
      relations: ['client'],
    });
    
    if (!fact) {
      throw new NotFoundException(`Fact with ID ${id} not found`);
    }
    
    Object.assign(fact, updateFactDto);
    return this.factsRepository.save(fact);
  }

  async remove(id: string, companyId: string) {
    const fact = await this.factsRepository.findOne({
      where: { 
        id,
        client: { company: { id: companyId } }
      },
      relations: ['client'],
    });
    
    if (!fact) {
      throw new NotFoundException(`Fact with ID ${id} not found`);
    }
    
    return this.factsRepository.remove(fact);
  }

  async linkToProcess(id: string, linkProcessDto: LinkProcessDto, companyId: string) {
    const fact = await this.factsRepository.findOne({
      where: { 
        id,
        client: { company: { id: companyId } }
      },
      relations: ['client'],
    });
    
    if (!fact) {
      throw new NotFoundException(`Fact with ID ${id} not found`);
    }
    
    fact.process = { id: linkProcessDto.processId } as any;
    return this.factsRepository.save(fact);
  }
}