import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FactsService } from '../services/facts.service';
import { CreateFactDto } from '../dto/create-fact.dto';
import { UpdateFactDto } from '../dto/update-fact.dto';
import { LinkProcessDto } from '../dto/link-process.dto';

@ApiTags('facts')
@Controller('facts')
@UseGuards(JwtAuthGuard)
export class FactsController {
  constructor(private readonly factsService: FactsService) {}

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get client facts' })
  @ApiResponse({ status: 200, description: 'Return client facts' })
  findByClient(@Param('clientId') clientId: string, @Request() req?: any) {
    return this.factsService.findByClient(clientId, req.user.companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new fact' })
  @ApiResponse({ status: 201, description: 'Fact successfully created' })
  create(@Body() createFactDto: CreateFactDto, @Request() req?: any) {
    return this.factsService.create(createFactDto, req.user.companyId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fact' })
  @ApiResponse({ status: 200, description: 'Fact successfully updated' })
  update(@Param('id') id: string, @Body() updateFactDto: UpdateFactDto, @Request() req?: any) {
    return this.factsService.update(id, updateFactDto, req.user.companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete fact' })
  @ApiResponse({ status: 200, description: 'Fact successfully deleted' })
  remove(@Param('id') id: string, @Request() req?: any) {
    return this.factsService.remove(id, req.user.companyId);
  }

  @Patch(':id/link-process')
  @ApiOperation({ summary: 'Link fact to process' })
  @ApiResponse({ status: 200, description: 'Fact successfully linked to process' })
  linkToProcess(@Param('id') id: string, @Body() linkProcessDto: LinkProcessDto, @Request() req?: any) {
    return this.factsService.linkToProcess(id, linkProcessDto, req.user.companyId);
  }
}