import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ClientsService } from '../services/clients.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

@ApiTags('clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'Return all clients' })
  findAll(@Query('search') search?: string, @Request() req?: any) {
    return this.clientsService.findAll(req.user.companyId, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by id' })
  @ApiResponse({ status: 200, description: 'Return client by id' })
  findOne(@Param('id') id: string, @Request() req?: any) {
    return this.clientsService.findOne(id, req.user.companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new client' })
  @ApiResponse({ status: 201, description: 'Client successfully created' })
  create(@Body() createClientDto: CreateClientDto, @Request() req?: any) {
    return this.clientsService.create(createClientDto, req.user.companyId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({ status: 200, description: 'Client successfully updated' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @Request() req?: any) {
    return this.clientsService.update(id, updateClientDto, req.user.companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  @ApiResponse({ status: 200, description: 'Client successfully deleted' })
  remove(@Param('id') id: string, @Request() req?: any) {
    return this.clientsService.remove(id, req.user.companyId);
  }
}