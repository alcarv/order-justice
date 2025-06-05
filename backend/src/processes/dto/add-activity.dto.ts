import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ActivityType {
  NOTE = 'note',
  STATUS_CHANGE = 'status_change',
  DOCUMENT_ADDED = 'document_added',
  ASSIGNMENT_CHANGE = 'assignment_change'
}

export class AddActivityDto {
  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  type: ActivityType;

  @ApiProperty({ example: 'Added new document: Contract draft' })
  @IsString()
  description: string;
}