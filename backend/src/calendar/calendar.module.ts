import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEvent } from './entities/calendar-event.entity';
import { CalendarReminder } from './entities/calendar-reminder.entity';
import { CalendarRecurrence } from './entities/calendar-recurrence.entity';
import { CalendarController } from './controllers/calendar.controller';
import { CalendarService } from './services/calendar.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CalendarEvent,
      CalendarReminder,
      CalendarRecurrence
    ]),
    AuthModule,
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [TypeOrmModule, CalendarService],
})
export class CalendarModule {}