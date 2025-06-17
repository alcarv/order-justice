import { IsOptional, IsDateString, IsEnum, IsUUID, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CalendarEventType, CalendarEventPriority } from '../entities/calendar-event.entity';

export class CalendarEventQueryDto {
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ enum: CalendarEventType, required: false })
  @IsEnum(CalendarEventType)
  @IsOptional()
  type?: CalendarEventType;

  @ApiProperty({ enum: CalendarEventPriority, required: false })
  @IsEnum(CalendarEventPriority)
  @IsOptional()
  priority?: CalendarEventPriority;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  processId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  contractId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  createdBy?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, description: 'Filter by user ID to show only their events' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false, description: 'Show only current user events when true' })
  @IsOptional()
  myEventsOnly?: boolean;
}