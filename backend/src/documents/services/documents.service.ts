import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Document } from '../entities/document.entity';
import { Process } from '../../processes/entities/process.entity';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { GetUploadUrlDto } from '../dto/get-upload-url.dto';

@Injectable()
export class DocumentsService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(Process)
    private processesRepository: Repository<Process>,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucket = this.configService.get('AWS_S3_BUCKET');
  }

  async getUploadUrl(dto: GetUploadUrlDto, companyId: string) {
    // Verify process belongs to company
    const process = await this.processesRepository.findOne({
      where: { id: dto.processId, company: { id: companyId } },
    });

    if (!process) {
      throw new NotFoundException(`Process with ID ${dto.processId} not found`);
    }

    const key = `documents/${dto.processId}/${Date.now()}-${dto.fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: dto.fileType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    const fileUrl = `https://${this.bucket}.s3.amazonaws.com/${key}`;

    return { uploadUrl, fileUrl };
  }

  async create(createDocumentDto: CreateDocumentDto, userId: string, companyId: string) {
    // Verify process belongs to company
    const process = await this.processesRepository.findOne({
      where: { id: createDocumentDto.processId, company: { id: companyId } },
    });

    if (!process) {
      throw new NotFoundException(`Process with ID ${createDocumentDto.processId} not found`);
    }

    const document = this.documentsRepository.create({
      ...createDocumentDto,
      uploadedBy: { id: userId },
      process: { id: createDocumentDto.processId },
      uploadedAt: new Date(),
    });

    return this.documentsRepository.save(document);
  }

  async getProcessDocuments(processId: string, companyId: string) {
    // Verify process belongs to company
    const process = await this.processesRepository.findOne({
      where: { id: processId, company: { id: companyId } },
    });

    if (!process) {
      throw new NotFoundException(`Process with ID ${processId} not found`);
    }

    return this.documentsRepository.find({
      where: { process: { id: processId } },
      relations: ['uploadedBy'],
      order: { uploadedAt: 'DESC' },
    });
  }
}