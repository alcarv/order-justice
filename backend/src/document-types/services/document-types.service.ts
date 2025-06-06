import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentType } from '../entities/document-type.entity';
import { CreateDocumentTypeDto } from '../dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from '../dto/update-document-type.dto';

@Injectable()
export class DocumentTypesService {
  constructor(
    @InjectRepository(DocumentType)
    private documentTypesRepository: Repository<DocumentType>,
  ) {}

  async findAll(companyId: string) {
    return this.documentTypesRepository.find({
      where: { company: { id: companyId } },
      order: { label: 'ASC' },
    });
  }

  async findOne(id: string, companyId: string) {
    const documentType = await this.documentTypesRepository.findOne({
      where: { id, company: { id: companyId } },
    });
    
    if (!documentType) {
      throw new NotFoundException(`Document type with ID ${id} not found`);
    }
    
    return documentType;
  }

  async create(createDocumentTypeDto: CreateDocumentTypeDto, companyId: string) {
    // Check if document type already exists for this company
    const existingDocumentType = await this.documentTypesRepository.findOne({
      where: { 
        type: createDocumentTypeDto.type,
        company: { id: companyId }
      },
    });

    if (existingDocumentType) {
      throw new ConflictException(`Document type ${createDocumentTypeDto.type} already exists for this company`);
    }

    const documentType = this.documentTypesRepository.create({
      ...createDocumentTypeDto,
      company: { id: companyId },
      isActive: createDocumentTypeDto.isActive ?? true,
    });

    return this.documentTypesRepository.save(documentType);
  }

  async update(id: string, updateDocumentTypeDto: UpdateDocumentTypeDto, companyId: string) {
    const documentType = await this.findOne(id, companyId);

    // If updating type, check for conflicts
    if (updateDocumentTypeDto.type && updateDocumentTypeDto.type !== documentType.type) {
      const existingDocumentType = await this.documentTypesRepository.findOne({
        where: { 
          type: updateDocumentTypeDto.type,
          company: { id: companyId },
          id: { $ne: id } as any
        },
      });

      if (existingDocumentType) {
        throw new ConflictException(`Document type ${updateDocumentTypeDto.type} already exists for this company`);
      }
    }

    Object.assign(documentType, updateDocumentTypeDto);
    return this.documentTypesRepository.save(documentType);
  }

  async remove(id: string, companyId: string) {
    const documentType = await this.findOne(id, companyId);
    
    // Check if document type is being used by any documents
    // This would require checking the documents table if you have foreign key relationships
    // For now, we'll just delete it
    
    return this.documentTypesRepository.remove(documentType);
  }

  async findByType(type: string, companyId: string) {
    return this.documentTypesRepository.findOne({
      where: { 
        type: type as any,
        company: { id: companyId },
        isActive: true
      },
    });
  }

  async getActiveDocumentTypes(companyId: string) {
    return this.documentTypesRepository.find({
      where: { 
        company: { id: companyId },
        isActive: true
      },
      order: { label: 'ASC' },
    });
  }
}