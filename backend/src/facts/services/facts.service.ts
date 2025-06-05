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

  async findByClient(clientId: string) {
    return this.factsRepository.find({
      where: { client: { id: clientId } },
      relations: ['client', 'reportedBy', 'process'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createFactDto: CreateFactDto) {
    const fact = this.factsRepository.create({
      client: { id: createFactDto.clientId },
      reportedBy: { id: createFactDto.reportedBy },
      content: createFactDto.content,
      process: createFactDto.processId ? { id: createFactDto.processId } : null,
    });
    return this.factsRepository.save(fact);
  }

  async update(id: string, updateFactDto: UpdateFactDto) {
    const fact = await this.factsRepository.findOne({ where: { id } });
    if (!fact) {
      throw new NotFoundException(`Fact with ID ${id} not found`);
    }
    Object.assign(fact, updateFactDto);
    return this.factsRepository.save(fact);
  }

  async remove(id: string) {
    const fact = await this.factsRepository.findOne({ where: { id } });
    if (!fact) {
      throw new NotFoundException(`Fact with ID ${id} not found`);
    }
    return this.factsRepository.remove(fact);
  }

  async linkToProcess(id: string, linkProcessDto: LinkProcessDto) {
    const fact = await this.factsRepository.findOne({ where: { id } });
    if (!fact) {
      throw new NotFoundException(`Fact with ID ${id} not found`);
    }
    fact.process = { id: linkProcessDto.processId } as any;
    return this.factsRepository.save(fact);
  }
}
