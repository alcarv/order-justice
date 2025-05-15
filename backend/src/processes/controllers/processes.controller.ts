import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
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
  ) {
    return this.processesService.findAll({ clientId, status, priority });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get process by id' })
  @ApiResponse({ status: 200, description: 'Return process by id' })
  findOne(@Param('id') id: string) {
    return this.processesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new process' })
  @ApiResponse({ status: 201, description: 'Process successfully created' })
  create(@Body() createProcessDto: CreateProcessDto) {
    return this.processesService.create(createProcessDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update process' })
  @ApiResponse({ status: 200, description: 'Process successfully updated' })
  update(@Param('id') id: string, @Body() updateProcessDto: UpdateProcessDto) {
    return this.processesService.update(id, updateProcessDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete process' })
  @ApiResponse({ status: 200, description: 'Process successfully deleted' })
  remove(@Param('id') id: string) {
    return this.processesService.remove(id);
  }

  @Post(':id/activities')
  @ApiOperation({ summary: 'Add activity to process' })
  @ApiResponse({ status: 201, description: 'Activity successfully added' })
  addActivity(@Param('id') id: string, @Body() addActivityDto: AddActivityDto) {
    return this.processesService.addActivity(id, addActivityDto);
  }

  @Get(':id/activities')
  @ApiOperation({ summary: 'Get process activities' })
  @ApiResponse({ status: 200, description: 'Return process activities' })
  getActivities(@Param('id') id: string) {
    return this.processesService.getActivities(id);
  }
}