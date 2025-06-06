import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypeEnum } from '../entities/document-type.entity';

export class CreateDocumentTypeDto {
  @ApiProperty({ enum: DocumentTypeEnum, example: DocumentTypeEnum.CPF })
  @IsEnum(DocumentTypeEnum)
  type: DocumentTypeEnum;

  @ApiProperty({ example: 'CPF - Cadastro de Pessoa Física' })
  @IsString()
  label: string;

  @ApiProperty({ example: 'Brazilian individual taxpayer registry', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}