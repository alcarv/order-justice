import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CompanyId } from '../../common/decorators/company.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ServicesService } from '../services/services.service';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { StartServiceDto } from '../dto/start-service.dto';
import { UpdateServiceStatusDto } from '../dto/update-service-status.dto';

@ApiTags('services')
@Controller('services')
@UseGuards(JwtAuthGuard, CompanyGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'Return all services' })
  findAll(@CompanyId() companyId?: string) {
    return this.servicesService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by id' })
  @ApiResponse({ status: 200, description: 'Return service by id' })
  findOne(@Param('id') id: string, @CompanyId() companyId?: string) {
    return this.servicesService.findOne(id, companyId);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new service' })
  @ApiResponse({ status: 201, description: 'Service successfully created' })
  create(@Body() createServiceDto: CreateServiceDto, @CompanyId() companyId?: string) {
    return this.servicesService.create(createServiceDto, companyId);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update service' })
  @ApiResponse({ status: 200, description: 'Service successfully updated' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto, @CompanyId() companyId?: string) {
    return this.servicesService.update(id, updateServiceDto, companyId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete service' })
  @ApiResponse({ status: 200, description: 'Service successfully deleted' })
  remove(@Param('id') id: string, @CompanyId() companyId?: string) {
    return this.servicesService.remove(id, companyId);
  }

  @Post('start')
  @ApiOperation({ summary: 'Start service for client' })
  @ApiResponse({ status: 201, description: 'Service successfully started' })
  startService(@Body() startServiceDto: StartServiceDto, @CompanyId() companyId?: string) {
    return this.servicesService.startService(startServiceDto, companyId);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get client services' })
  @ApiResponse({ status: 200, description: 'Return client services' })
  getClientServices(@Param('clientId') clientId: string, @CompanyId() companyId?: string) {
    return this.servicesService.getClientServices(clientId, companyId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update service status' })
  @ApiResponse({ status: 200, description: 'Service status successfully updated' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateServiceStatusDto,
    @CompanyId() companyId?: string,
  ) {
    return this.servicesService.updateStatus(id, updateStatusDto, companyId);
  }

  @Delete('client-service/:id')
  @ApiOperation({ summary: 'Delete client service' })
  @ApiResponse({ status: 200, description: 'Client service successfully deleted' })
  deleteClientService(@Param('id') id: string, @CompanyId() companyId?: string) {
    return this.servicesService.deleteClientService(id, companyId);
  }
}