import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DocumentsService } from '../services/documents.service';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { GetUploadUrlDto } from '../dto/get-upload-url.dto';

@ApiTags('documents')
@Controller('processes/documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Get pre-signed URL for file upload' })
  @ApiResponse({ status: 200, description: 'Returns upload and file URLs' })
  getUploadUrl(@Body() dto: GetUploadUrlDto) {
    return this.documentsService.getUploadUrl(dto);
  }

  @Post()
  @ApiOperation({ summary: 'Create document record' })
  @ApiResponse({ status: 201, description: 'Document record created' })
  create(@Body() createDocumentDto: CreateDocumentDto, @Req() req: any) {
    return this.documentsService.create(createDocumentDto, req.user.id);
  }
}