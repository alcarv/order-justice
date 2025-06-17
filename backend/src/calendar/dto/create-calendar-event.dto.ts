import { IsString, IsEnum, IsOptional, IsDateString, IsBoolean, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CalendarEventType, CalendarEventPriority } from '../entities/calendar-event.entity';

export class CreateCalendarEventDto {
  @ApiProperty({ example: 'Contract Review Meeting' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Review and discuss the new client contract terms', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: CalendarEventType, example: CalendarEventType.MEETING })
  @IsEnum(CalendarEventType)
  type: CalendarEventType;

  @ApiProperty({ enum: CalendarEventPriority, example: CalendarEventPriority.HIGH })
  @IsEnum(CalendarEventPriority)
  priority: CalendarEventPriority;

  @ApiProperty({ example: '2024-02-15T09:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2024-02-15T10:00:00.000Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  allDay?: boolean;

  @ApiProperty({ example: 'Conference Room A', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsUUID()
  @IsOptional()
  processId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsUUID()
  @IsOptional()
  contractId?: string;

  @ApiProperty({ example: ['john@example.com', 'jane@example.com'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attendees?: string[];

  @ApiProperty({ example: '#3B82F6', required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  createdBy: string;
}