import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContractDocumentType } from '../entities/contract-document.entity';

export class UploadContractDocumentDto {
  @ApiProperty({ example: 'Contract Amendment #1' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'First amendment to the original contract' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ContractDocumentType, example: ContractDocumentType.AMENDMENT })
  @IsEnum(ContractDocumentType)
  documentType: ContractDocumentType;

  @ApiProperty({ example: ['amendment', 'legal', 'contract'], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];
}