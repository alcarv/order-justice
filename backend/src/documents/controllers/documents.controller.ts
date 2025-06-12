import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionGuard } from '../../auth/guards/session.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import { CompanyId } from '../../common/decorators/company.decorator';
import { DocumentsService } from '../services/documents.service';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { GetUploadUrlDto } from '../dto/get-upload-url.dto';

@ApiTags('documents')
@Controller('processes/documents')
@UseGuards(SessionGuard, CompanyGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Get pre-signed URL for file upload' })
  @ApiResponse({ status: 200, description: 'Returns upload and file URLs' })
  getUploadUrl(@Body() dto: GetUploadUrlDto, @CompanyId() companyId?: string) {
    return this.documentsService.getUploadUrl(dto, companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create document record' })
  @ApiResponse({ status: 201, description: 'Document record created' })
  create(@Body() createDocumentDto: CreateDocumentDto, @Req() req: any, @CompanyId() companyId?: string) {
    return this.documentsService.create(createDocumentDto, req.user.id, companyId);
  }

  @Get('process/:processId')
  @ApiOperation({ summary: 'Get documents for a process' })
  @ApiResponse({ status: 200, description: 'Returns process documents' })
  getProcessDocuments(@Param('processId') processId: string, @CompanyId() companyId?: string) {
    return this.documentsService.getProcessDocuments(processId, companyId);
  }
}