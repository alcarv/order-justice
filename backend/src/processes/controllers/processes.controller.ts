import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProcessesService } from '../services/processes.service';
import { CreateProcessDto } from '../dto/create-process.dto';
import { UpdateProcessDto } from '../dto/update-process.dto';
import { AddActivityDto } from '../dto/add-activity.dto';

@ApiTags('processes')
@Controller('processes')
@UseGuards(JwtAuthGuard)
export class ProcessesController {
  constructor(private readonly processesService: ProcessesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all processes' })
  @ApiResponse({ status: 200, description: 'Return all processes' })
  findAll(
    @Query('clientId') clientId?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Request() req?: any,
  ) {
    return this.processesService.findAll(req.user.companyId, { clientId, status, priority });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get process by id' })
  @ApiResponse({ status: 200, description: 'Return process by id' })
  findOne(@Param('id') id: string, @Request() req?: any) {
    return this.processesService.findOne(id, req.user.companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new process' })
  @ApiResponse({ status: 201, description: 'Process successfully created' })
  create(@Body() createProcessDto: CreateProcessDto, @Request() req?: any) {
    return this.processesService.create(createProcessDto, req.user.companyId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update process' })
  @ApiResponse({ status: 200, description: 'Process successfully updated' })
  update(@Param('id') id: string, @Body() updateProcessDto: UpdateProcessDto, @Request() req?: any) {
    return this.processesService.update(id, updateProcessDto, req.user.companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete process' })
  @ApiResponse({ status: 200, description: 'Process successfully deleted' })
  remove(@Param('id') id: string, @Request() req?: any) {
    return this.processesService.remove(id, req.user.companyId);
  }

  @Post(':id/activities')
  @ApiOperation({ summary: 'Add activity to process' })
  @ApiResponse({ status: 201, description: 'Activity successfully added' })
  addActivity(@Param('id') id: string, @Body() addActivityDto: AddActivityDto, @Request() req?: any) {
    return this.processesService.addActivity(id, addActivityDto, req.user.companyId, req.user.id);
  }

  @Get(':id/activities')
  @ApiOperation({ summary: 'Get process activities' })
  @ApiResponse({ status: 200, description: 'Return process activities' })
  getActivities(@Param('id') id: string, @Request() req?: any) {
    return this.processesService.getActivities(id, req.user.companyId);
  }
}