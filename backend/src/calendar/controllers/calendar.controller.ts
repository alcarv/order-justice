import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Patch,
  Body, 
  Param, 
  Query,
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionGuard } from '../../auth/guards/session.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import { CompanyId } from '../../common/decorators/company.decorator';
import { CalendarService } from '../services/calendar.service';
import { CreateCalendarEventDto } from '../dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from '../dto/update-calendar-event.dto';
import { CalendarEventQueryDto } from '../dto/calendar-event-query.dto';
import { CreateCalendarReminderDto } from '../dto/create-calendar-reminder.dto';

@ApiTags('calendar')
@Controller('calendar')
@UseGuards(SessionGuard, CompanyGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  @ApiOperation({ summary: 'Get calendar events' })
  @ApiResponse({ status: 200, description: 'Return calendar events' })
  findAllEvents(
    @Query() query: CalendarEventQueryDto,
    @CompanyId() companyId: string,
    @Request() req: any
  ) {
    return this.calendarService.findAllEvents(companyId, query, req.user.id);
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Get calendar event by id' })
  @ApiResponse({ status: 200, description: 'Return calendar event by id' })
  findOneEvent(
    @Param('id') id: string, 
    @CompanyId() companyId: string
  ) {
    return this.calendarService.findOneEvent(id, companyId);
  }

  @Post('events')
  @ApiOperation({ summary: 'Create new calendar event' })
  @ApiResponse({ status: 201, description: 'Calendar event successfully created' })
  createEvent(
    @Body() createEventDto: CreateCalendarEventDto, 
    @CompanyId() companyId: string
  ) {
    return this.calendarService.createEvent(createEventDto, companyId);
  }

  @Put('events/:id')
  @ApiOperation({ summary: 'Update calendar event' })
  @ApiResponse({ status: 200, description: 'Calendar event successfully updated' })
  updateEvent(
    @Param('id') id: string, 
    @Body() updateEventDto: UpdateCalendarEventDto, 
    @CompanyId() companyId: string,
    @Request() req: any
  ) {
    return this.calendarService.updateEvent(id, updateEventDto, companyId, req.user.id);
  }

  @Delete('events/:id')
  @ApiOperation({ summary: 'Delete calendar event' })
  @ApiResponse({ status: 200, description: 'Calendar event successfully deleted' })
  removeEvent(
    @Param('id') id: string, 
    @CompanyId() companyId: string,
    @Request() req: any
  ) {
    return this.calendarService.removeEvent(id, companyId, req.user.id);
  }

  @Patch('events/:id/complete')
  @ApiOperation({ summary: 'Mark calendar event as completed' })
  @ApiResponse({ status: 200, description: 'Calendar event marked as completed' })
  completeEvent(
    @Param('id') id: string, 
    @CompanyId() companyId: string,
    @Request() req: any
  ) {
    return this.calendarService.completeEvent(id, companyId, req.user.id);
  }

  @Get('events/upcoming/:days')
  @ApiOperation({ summary: 'Get upcoming events for specified number of days' })
  @ApiResponse({ status: 200, description: 'Return upcoming events' })
  getUpcomingEvents(
    @Param('days') days: number,
    @CompanyId() companyId: string
  ) {
    return this.calendarService.getUpcomingEvents(companyId, days);
  }

  @Get('events/overdue')
  @ApiOperation({ summary: 'Get overdue events' })
  @ApiResponse({ status: 200, description: 'Return overdue events' })
  getOverdueEvents(@CompanyId() companyId: string) {
    return this.calendarService.getOverdueEvents(companyId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get calendar statistics' })
  @ApiResponse({ status: 200, description: 'Return calendar statistics' })
  getCalendarStats(@CompanyId() companyId: string) {
    return this.calendarService.getCalendarStats(companyId);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get company users for filtering' })
  @ApiResponse({ status: 200, description: 'Return company users' })
  getCompanyUsers(@CompanyId() companyId: string) {
    return this.calendarService.getCompanyUsers(companyId);
  }

  // Calendar Reminders
  @Post('events/:eventId/reminders')
  @ApiOperation({ summary: 'Add reminder to calendar event' })
  @ApiResponse({ status: 201, description: 'Reminder successfully added' })
  addReminder(
    @Param('eventId') eventId: string,
    @Body() createReminderDto: CreateCalendarReminderDto,
    @CompanyId() companyId: string
  ) {
    return this.calendarService.addReminder(eventId, createReminderDto, companyId);
  }

  @Get('events/:eventId/reminders')
  @ApiOperation({ summary: 'Get reminders for calendar event' })
  @ApiResponse({ status: 200, description: 'Return event reminders' })
  getEventReminders(
    @Param('eventId') eventId: string,
    @CompanyId() companyId: string
  ) {
    return this.calendarService.getEventReminders(eventId, companyId);
  }

  @Delete('reminders/:reminderId')
  @ApiOperation({ summary: 'Remove reminder' })
  @ApiResponse({ status: 200, description: 'Reminder successfully removed' })
  removeReminder(
    @Param('reminderId') reminderId: string,
    @CompanyId() companyId: string
  ) {
    return this.calendarService.removeReminder(reminderId, companyId);
  }
}