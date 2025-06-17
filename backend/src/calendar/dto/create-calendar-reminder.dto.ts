import { IsEnum, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CalendarReminderType } from '../entities/calendar-reminder.entity';

export class CreateCalendarReminderDto {
  @ApiProperty({ enum: CalendarReminderType, example: CalendarReminderType.NOTIFICATION })
  @IsEnum(CalendarReminderType)
  type: CalendarReminderType;

  @ApiProperty({ example: 15 })
  @IsNumber()
  minutesBefore: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}