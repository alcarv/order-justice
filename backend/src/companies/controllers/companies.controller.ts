import { Controller, Get, Post, Body, UseGuards, Put, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionGuard } from '../../auth/guards/session.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CompaniesService } from '../services/companies.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateLicenseDto } from '../dto/update-license.dto';

@ApiTags('companies')
@Controller('companies')
@UseGuards(SessionGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new company' })
  @ApiResponse({ status: 201, description: 'Company successfully created' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ status: 200, description: 'Return all companies' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Put(':id/license')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update company license limit' })
  @ApiResponse({ status: 200, description: 'License limit updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid license limit' })
  updateLicense(@Param('id') id: string, @Body() updateLicenseDto: UpdateLicenseDto) {
    return this.companiesService.updateLicenseLimit(id, updateLicenseDto.licenseLimit);
  }
}