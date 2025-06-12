import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionGuard } from '../../auth/guards/session.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import { CompanyId } from '../../common/decorators/company.decorator';
import { ClientsService } from '../services/clients.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

@ApiTags('clients')
@Controller('clients')
@UseGuards(SessionGuard, CompanyGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'Return all clients' })
  findAll(@Query('search') search?: string, @CompanyId() companyId?: string) {
    return this.clientsService.findAll(companyId, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by id' })
  @ApiResponse({ status: 200, description: 'Return client by id' })
  findOne(@Param('id') id: string, @CompanyId() companyId?: string) {
    return this.clientsService.findOne(id, companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new client' })
  @ApiResponse({ status: 201, description: 'Client successfully created' })
  create(@Body() createClientDto: CreateClientDto, @CompanyId() companyId?: string) {
    return this.clientsService.create(createClientDto, companyId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({ status: 200, description: 'Client successfully updated' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @CompanyId() companyId?: string) {
    return this.clientsService.update(id, updateClientDto, companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  @ApiResponse({ status: 200, description: 'Client successfully deleted' })
  remove(@Param('id') id: string, @CompanyId() companyId?: string) {
    return this.clientsService.remove(id, companyId);
  }
}