import { IsString, IsUUID, IsEnum, IsOptional, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProcessStatus, ProcessPriority } from '../entities/process.entity';

export class CreateProcessDto {
  @ApiProperty({ example: 'Corporate Restructuring Case' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Legal assistance for corporate restructuring' })
  @IsString()
  description: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  clientId: string;

  @ApiProperty({ enum: ProcessStatus, example: ProcessStatus.PENDING })
  @IsEnum(ProcessStatus)
  status: ProcessStatus;

  @ApiProperty({ enum: ProcessPriority, example: ProcessPriority.MEDIUM })
  @IsEnum(ProcessPriority)
  priority: ProcessPriority;

  @ApiProperty({ type: [String], example: ['123e4567-e89b-12d3-a456-426614174000'] })
  @IsArray()
  @IsUUID('4', { each: true })
  assignedTo: string[];

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  createdBy: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  court?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  caseNumber?: string;
}