import { IsString, IsNumber, IsUUID, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty()
  @IsUUID()
  processId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  fileUrl: string;

  @ApiProperty()
  @IsString()
  fileType: string;

  @ApiProperty()
  @IsNumber()
  fileSize: number;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];
}