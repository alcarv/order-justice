import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
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
  getUploadUrl(@Body() dto: GetUploadUrlDto, @Req() req: any) {
    return this.documentsService.getUploadUrl(dto, req.user.companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create document record' })
  @ApiResponse({ status: 201, description: 'Document record created' })
  create(@Body() createDocumentDto: CreateDocumentDto, @Req() req: any) {
    return this.documentsService.create(createDocumentDto, req.user.id, req.user.companyId);
  }

  @Get('process/:processId')
  @ApiOperation({ summary: 'Get documents for a process' })
  @ApiResponse({ status: 200, description: 'Returns process documents' })
  getProcessDocuments(@Param('processId') processId: string, @Req() req: any) {
    return this.documentsService.getProcessDocuments(processId, req.user.companyId);
  }
}