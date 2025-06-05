import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Document } from '../entities/document.entity';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { GetUploadUrlDto } from '../dto/get-upload-url.dto';

@Injectable()
export class DocumentsService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
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

  async getUploadUrl(dto: GetUploadUrlDto) {
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

  async create(createDocumentDto: CreateDocumentDto, userId: string) {
    const document = this.documentsRepository.create({
      ...createDocumentDto,
      uploadedBy: { id: userId },
      process: { id: createDocumentDto.processId },
      uploadedAt: new Date(),
    });

    return this.documentsRepository.save(document);
  }
}