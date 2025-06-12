import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete, 
    Body, 
    Param, 
    UseGuards, 
    Query, 
    Request,
    UseInterceptors,
    UploadedFile
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { SessionGuard } from '../../auth/guards/session.guard';
  import { CompanyGuard } from '../../common/guards/company.guard';
  import { CompanyId } from '../../common/decorators/company.decorator';
  import { ContractsService } from '../services/contracts.service';
  import { CreateContractDto } from '../dto/create-contract.dto';
  import { UpdateContractDto } from '../dto/update-contract.dto';
  import { CreateContractValueDto } from '../dto/create-contract-value.dto';
  import { UpdateContractValueDto } from '../dto/update-contract-value.dto';
  import { UploadContractDocumentDto } from '../dto/upload-contract-document.dto';
  
  @ApiTags('contracts')
  @Controller('contracts')
  @UseGuards(SessionGuard, CompanyGuard)
  export class ContractsController {
    constructor(private readonly contractsService: ContractsService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get all contracts' })
    @ApiResponse({ status: 200, description: 'Return all contracts' })
    findAll(
      @Query('clientId') clientId?: string,
      @Query('status') status?: string,
      @Query('contractType') contractType?: string,
      @CompanyId() companyId?: string,
    ) {
      return this.contractsService.findAll(companyId, { clientId, status, contractType });
    }
  
    @Get('stats')
    @ApiOperation({ summary: 'Get contract statistics' })
    @ApiResponse({ status: 200, description: 'Return contract statistics' })
    getStats(@CompanyId() companyId?: string) {
      return this.contractsService.getContractStats(companyId);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get contract by id' })
    @ApiResponse({ status: 200, description: 'Return contract by id' })
    findOne(@Param('id') id: string, @CompanyId() companyId?: string) {
      return this.contractsService.findOne(id, companyId);
    }
  
    @Post()
    @ApiOperation({ summary: 'Create new contract' })
    @ApiResponse({ status: 201, description: 'Contract successfully created' })
    create(@Body() createContractDto: CreateContractDto, @CompanyId() companyId?: string) {
      return this.contractsService.create(createContractDto, companyId);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update contract' })
    @ApiResponse({ status: 200, description: 'Contract successfully updated' })
    update(
      @Param('id') id: string, 
      @Body() updateContractDto: UpdateContractDto, 
      @CompanyId() companyId?: string,
      @Request() req?: any
    ) {
      return this.contractsService.update(id, updateContractDto, companyId, req.user.id);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete contract' })
    @ApiResponse({ status: 200, description: 'Contract successfully deleted' })
    remove(@Param('id') id: string, @CompanyId() companyId?: string, @Request() req?: any) {
      return this.contractsService.remove(id, companyId, req.user.id);
    }
  
    @Post(':id/values')
    @ApiOperation({ summary: 'Add payment entry to contract' })
    @ApiResponse({ status: 201, description: 'Payment entry successfully added' })
    addValue(
      @Param('id') contractId: string,
      @Body() createValueDto: CreateContractValueDto,
      @CompanyId() companyId?: string,
      @Request() req?: any
    ) {
      return this.contractsService.addValue(contractId, createValueDto, companyId, req.user.id);
    }
  
    @Put('values/:valueId')
    @ApiOperation({ summary: 'Update payment entry' })
    @ApiResponse({ status: 200, description: 'Payment entry successfully updated' })
    updateValue(
      @Param('valueId') valueId: string,
      @Body() updateValueDto: UpdateContractValueDto,
      @CompanyId() companyId?: string,
      @Request() req?: any
    ) {
      return this.contractsService.updateValue(valueId, updateValueDto, companyId, req.user.id);
    }
  
    @Delete('values/:valueId')
    @ApiOperation({ summary: 'Remove payment entry' })
    @ApiResponse({ status: 200, description: 'Payment entry successfully removed' })
    removeValue(
      @Param('valueId') valueId: string,
      @CompanyId() companyId?: string,
      @Request() req?: any
    ) {
      return this.contractsService.removeValue(valueId, companyId, req.user.id);
    }
  
    @Get(':id/documents')
    @ApiOperation({ summary: 'Get contract documents' })
    @ApiResponse({ status: 200, description: 'Return contract documents' })
    getDocuments(@Param('id') contractId: string, @CompanyId() companyId?: string) {
      return this.contractsService.getContractDocuments(contractId, companyId);
    }
  
    @Post(':id/documents')
    @ApiOperation({ summary: 'Upload contract document' })
    @ApiResponse({ status: 201, description: 'Document successfully uploaded' })
    @UseInterceptors(FileInterceptor('file'))
    uploadDocument(
      @Param('id') contractId: string,
      @Body() uploadDto: UploadContractDocumentDto,
      @UploadedFile() file: any,
      @CompanyId() companyId?: string,
      @Request() req?: any
    ) {
      const documentData = {
        ...uploadDto,
        fileUrl: `https://example.com/uploads/${file.filename}`,
        fileSize: file.size,
      };
  
      return this.contractsService.addDocument(contractId, documentData, companyId, req.user.id);
    }
  
    @Delete('documents/:documentId')
    @ApiOperation({ summary: 'Remove contract document' })
    @ApiResponse({ status: 200, description: 'Document successfully removed' })
    removeDocument(
      @Param('documentId') documentId: string,
      @CompanyId() companyId?: string,
      @Request() req?: any
    ) {
      return this.contractsService.removeDocument(documentId, companyId, req.user.id);
    }
  }