import { IsString, IsEnum, IsNumber, IsUUID, IsOptional, IsDateString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus, ContractType } from '../entities/contract.entity';

export class CreateContractDto {
  @ApiProperty({ example: 'Legal Services Agreement' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Comprehensive legal services for corporate matters' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  clientId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsUUID()
  @IsOptional()
  processId?: string;

  @ApiProperty({ enum: ContractStatus, example: ContractStatus.DRAFT })
  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @ApiProperty({ enum: ContractType, example: ContractType.RETAINER })
  @IsEnum(ContractType)
  contractType: ContractType;

  @ApiProperty({ example: 10000.00 })
  @IsNumber()
  totalValue: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: 'Standard terms and conditions apply...' })
  @IsString()
  @IsOptional()
  termsAndConditions?: string;

  @ApiProperty({ example: 'Additional notes about the contract' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  createdBy: string;
}