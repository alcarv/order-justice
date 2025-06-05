import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Legal Consultation' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Initial legal consultation and case evaluation' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 150.00 })
  @IsNumber()
  price: number;
}