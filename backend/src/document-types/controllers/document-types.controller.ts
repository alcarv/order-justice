import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { DocumentTypesService } from '../services/document-types.service';
import { CreateDocumentTypeDto } from '../dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from '../dto/update-document-type.dto';

@ApiTags('document-types')
@Controller('document-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all document types' })
  @ApiResponse({ status: 200, description: 'Return all document types' })
  findAll(@Request() req: any) {
    return this.documentTypesService.findAll(req.user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document type by id' })
  @ApiResponse({ status: 200, description: 'Return document type by id' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.documentTypesService.findOne(id, req.user.companyId);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiOperation({ summary: 'Create new document type' })
  @ApiResponse({ status: 201, description: 'Document type successfully created' })
  create(@Body() createDocumentTypeDto: CreateDocumentTypeDto, @Request() req: any) {
    return this.documentTypesService.create(createDocumentTypeDto, req.user.companyId);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiOperation({ summary: 'Update document type' })
  @ApiResponse({ status: 200, description: 'Document type successfully updated' })
  update(
    @Param('id') id: string, 
    @Body() updateDocumentTypeDto: UpdateDocumentTypeDto,
    @Request() req: any
  ) {
    return this.documentTypesService.update(id, updateDocumentTypeDto, req.user.companyId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiOperation({ summary: 'Delete document type' })
  @ApiResponse({ status: 200, description: 'Document type successfully deleted' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.documentTypesService.remove(id, req.user.companyId);
  }
}