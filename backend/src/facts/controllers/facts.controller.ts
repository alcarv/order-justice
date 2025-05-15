import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
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
  findByClient(@Param('clientId') clientId: string) {
    return this.factsService.findByClient(clientId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new fact' })
  @ApiResponse({ status: 201, description: 'Fact successfully created' })
  create(@Body() createFactDto: CreateFactDto) {
    return this.factsService.create(createFactDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fact' })
  @ApiResponse({ status: 200, description: 'Fact successfully updated' })
  update(@Param('id') id: string, @Body() updateFactDto: UpdateFactDto) {
    return this.factsService.update(id, updateFactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete fact' })
  @ApiResponse({ status: 200, description: 'Fact successfully deleted' })
  remove(@Param('id') id: string) {
    return this.factsService.remove(id);
  }

  @Put(':id/link-process')
  @ApiOperation({ summary: 'Link fact to process' })
  @ApiResponse({ status: 200, description: 'Fact successfully linked to process' })
  linkToProcess(@Param('id') id: string, @Body() linkProcessDto: LinkProcessDto) {
    return this.factsService.linkToProcess(id, linkProcessDto);
  }
}