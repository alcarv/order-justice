import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const company = this.companiesRepository.create({
      ...createCompanyDto,
      licenseLimit: 5,
      licenseUsed: 0,
    });
    return this.companiesRepository.save(company);
  }

  async findAll() {
    return this.companiesRepository.find();
  }

  async findOne(id: string) {
    return this.companiesRepository.findOne({ where: { id } });
  }

  async updateLicenseLimit(id: string, newLimit: number) {
    const company = await this.companiesRepository.findOne({ where: { id } });
    
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (newLimit < company.licenseUsed) {
      throw new BadRequestException(
        `Cannot set license limit to ${newLimit}. Currently ${company.licenseUsed} licenses are in use.`
      );
    }

    await this.companiesRepository.update(id, { licenseLimit: newLimit });
    
    return this.companiesRepository.findOne({ where: { id } });
  }

  async getLicenseInfo(companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return {
      licenseLimit: company.licenseLimit,
      licenseUsed: company.licenseUsed,
      availableLicenses: company.licenseLimit - company.licenseUsed,
    };
  }
}