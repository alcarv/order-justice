import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionGuard } from '../../auth/guards/session.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import { CompanyId } from '../../common/decorators/company.decorator';
import { FactsService } from '../services/facts.service';
import { CreateFactDto } from '../dto/create-fact.dto';
import { UpdateFactDto } from '../dto/update-fact.dto';
import { LinkProcessDto } from '../dto/link-process.dto';

@ApiTags('facts')
@Controller('facts')
@UseGuards(SessionGuard, CompanyGuard)
export class FactsController {
  constructor(private readonly factsService: FactsService) {}

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get client facts' })
  @ApiResponse({ status: 200, description: 'Return client facts' })
  findByClient(@Param('clientId') clientId: string, @CompanyId() companyId?: string) {
    return this.factsService.findByClient(clientId, companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new fact' })
  @ApiResponse({ status: 201, description: 'Fact successfully created' })
  create(@Body() createFactDto: CreateFactDto, @CompanyId() companyId?: string) {
    return this.factsService.create(createFactDto, companyId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fact' })
  @ApiResponse({ status: 200, description: 'Fact successfully updated' })
  update(@Param('id') id: string, @Body() updateFactDto: UpdateFactDto, @CompanyId() companyId?: string) {
    return this.factsService.update(id, updateFactDto, companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete fact' })
  @ApiResponse({ status: 200, description: 'Fact successfully deleted' })
  remove(@Param('id') id: string, @CompanyId() companyId?: string) {
    return this.factsService.remove(id, companyId);
  }

  @Put(':id/link-process')
  @ApiOperation({ summary: 'Link fact to process' })
  @ApiResponse({ status: 200, description: 'Fact successfully linked to process' })
  linkToProcess(@Param('id') id: string, @Body() linkProcessDto: LinkProcessDto, @CompanyId() companyId?: string) {
    return this.factsService.linkToProcess(id, linkProcessDto, companyId);
  }
}