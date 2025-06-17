import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { CalendarEvent } from '../entities/calendar-event.entity';
import { CalendarReminder } from '../entities/calendar-reminder.entity';
import { CalendarRecurrence } from '../entities/calendar-recurrence.entity';
import { CreateCalendarEventDto } from '../dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from '../dto/update-calendar-event.dto';
import { CalendarEventQueryDto } from '../dto/calendar-event-query.dto';
import { CreateCalendarReminderDto } from '../dto/create-calendar-reminder.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private calendarEventRepository: Repository<CalendarEvent>,
    @InjectRepository(CalendarReminder)
    private calendarReminderRepository: Repository<CalendarReminder>,
    @InjectRepository(CalendarRecurrence)
    private calendarRecurrenceRepository: Repository<CalendarRecurrence>,
  ) {}

  async findAllEvents(companyId: string, query: CalendarEventQueryDto, currentUserId?: string) {
    const queryBuilder = this.calendarEventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.client', 'client')
      .leftJoinAndSelect('event.process', 'process')
      .leftJoinAndSelect('event.contract', 'contract')
      .leftJoinAndSelect('event.createdBy', 'createdBy')
      .leftJoinAndSelect('event.reminders', 'reminders')
      .where('event.companyId = :companyId', { companyId })
      .orderBy('event.startTime', 'ASC');

    if (query.startDate && query.endDate) {
      queryBuilder.andWhere('event.startTime BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate
      });
    } else if (query.startDate) {
      queryBuilder.andWhere('event.startTime >= :startDate', {
        startDate: query.startDate
      });
    } else if (query.endDate) {
      queryBuilder.andWhere('event.startTime <= :endDate', {
        endDate: query.endDate
      });
    }

    if (query.type) {
      queryBuilder.andWhere('event.type = :type', { type: query.type });
    }
    if (query.priority) {
      queryBuilder.andWhere('event.priority = :priority', { priority: query.priority });
    }
    if (query.clientId) {
      queryBuilder.andWhere('event.clientId = :clientId', { clientId: query.clientId });
    }
    if (query.processId) {
      queryBuilder.andWhere('event.processId = :processId', { processId: query.processId });
    }
    if (query.contractId) {
      queryBuilder.andWhere('event.contractId = :contractId', { contractId: query.contractId });
    }

    if (query.myEventsOnly && currentUserId) {
      queryBuilder.andWhere('event.createdBy = :currentUserId', { currentUserId });
    } else if (query.userId) {
      queryBuilder.andWhere('event.createdBy = :userId', { userId: query.userId });
    } else if (query.createdBy) {
      queryBuilder.andWhere('event.createdBy = :createdBy', { createdBy: query.createdBy });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(event.title ILIKE :search OR event.description ILIKE :search OR event.location ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    return queryBuilder.getMany();
  }

  async findOneEvent(id: string, companyId: string) {
    const event = await this.calendarEventRepository.findOne({
      where: { id, company: { id: companyId } },
      relations: [
        'client', 
        'process', 
        'contract', 
        'createdBy', 
        'reminders',
        'recurrence'
      ],
    });

    if (!event) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }

    return event;
  }

  async createEvent(createEventDto: CreateCalendarEventDto, companyId: string) {
    const event = this.calendarEventRepository.create({
      ...createEventDto,
      startTime: new Date(createEventDto.startTime),
      endTime: new Date(createEventDto.endTime),
      company: { id: companyId },
      createdBy: { id: createEventDto.createdBy },
      client: createEventDto.clientId ? { id: createEventDto.clientId } : null,
      process: createEventDto.processId ? { id: createEventDto.processId } : null,
      contract: createEventDto.contractId ? { id: createEventDto.contractId } : null,
    });

    const savedEvent = await this.calendarEventRepository.save(event);

    return this.findOneEvent(savedEvent.id, companyId);
  }

  async updateEvent(id: string, updateEventDto: UpdateCalendarEventDto, companyId: string, userId: string) {
    const event = await this.findOneEvent(id, companyId);

    if (event.createdBy.id !== userId) {
      throw new ForbiddenException('You can only update events you created');
    }

    const updateData: any = {
      ...updateEventDto,
    };

    delete updateData.createdBy;

    if (updateEventDto.startTime) {
      updateData.startTime = new Date(updateEventDto.startTime);
    }
    if (updateEventDto.endTime) {
      updateData.endTime = new Date(updateEventDto.endTime);
    }

    // Handle relationship fields
    if (updateEventDto.clientId !== undefined) {
      updateData.client = updateEventDto.clientId ? { id: updateEventDto.clientId } : null;
      delete updateData.clientId;
    }
    if (updateEventDto.processId !== undefined) {
      updateData.process = updateEventDto.processId ? { id: updateEventDto.processId } : null;
      delete updateData.processId;
    }
    if (updateEventDto.contractId !== undefined) {
      updateData.contract = updateEventDto.contractId ? { id: updateEventDto.contractId } : null;
      delete updateData.contractId;
    }

    await this.calendarEventRepository.update(id, updateData);

    return this.findOneEvent(id, companyId);
  }

  async removeEvent(id: string, companyId: string, userId: string) {
    const event = await this.findOneEvent(id, companyId);

    // Check if user has permission to delete this event
    if (event.createdBy.id !== userId) {
      throw new ForbiddenException('You can only delete events you created');
    }

    await this.calendarEventRepository.remove(event);
    return { id, message: 'Calendar event deleted successfully' };
  }

  async completeEvent(id: string, companyId: string, userId: string) {
    const event = await this.findOneEvent(id, companyId);

    // Check if user has permission to complete this event
    if (event.createdBy.id !== userId) {
      throw new ForbiddenException('You can only complete events you created');
    }

    await this.calendarEventRepository.update(id, {
      isCompleted: true,
      completedAt: new Date(),
    });

    return { 
      id, 
      isCompleted: true, 
      completedAt: new Date(),
      message: 'Event marked as completed' 
    };
  }

  async getUpcomingEvents(companyId: string, days: number = 7) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return this.calendarEventRepository.find({
      where: {
        company: { id: companyId },
        startTime: Between(now, futureDate),
        isCompleted: false,
      },
      relations: ['client', 'process', 'contract', 'createdBy'],
      order: { startTime: 'ASC' },
    });
  }

  async getOverdueEvents(companyId: string) {
    const now = new Date();

    return this.calendarEventRepository.find({
      where: {
        company: { id: companyId },
        endTime: LessThan(now),
        isCompleted: false,
      },
      relations: ['client', 'process', 'contract', 'createdBy'],
      order: { endTime: 'DESC' },
    });
  }

  async getCalendarStats(companyId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const totalEvents = await this.calendarEventRepository.count({
      where: { company: { id: companyId } },
    });

    const completedEvents = await this.calendarEventRepository.count({
      where: { company: { id: companyId }, isCompleted: true },
    });

    const upcomingEvents = await this.calendarEventRepository.count({
      where: {
        company: { id: companyId },
        startTime: MoreThan(now),
        isCompleted: false,
      },
    });

    const overdueEvents = await this.calendarEventRepository.count({
      where: {
        company: { id: companyId },
        endTime: LessThan(now),
        isCompleted: false,
      },
    });

    const thisMonthEvents = await this.calendarEventRepository.count({
      where: {
        company: { id: companyId },
        startTime: Between(startOfMonth, endOfMonth),
      },
    });

    const eventsByType = await this.calendarEventRepository
      .createQueryBuilder('event')
      .select('event.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('event.companyId = :companyId', { companyId })
      .groupBy('event.type')
      .getRawMany();

    const eventsByPriority = await this.calendarEventRepository
      .createQueryBuilder('event')
      .select('event.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .where('event.companyId = :companyId', { companyId })
      .groupBy('event.priority')
      .getRawMany();

    const eventsByUser = await this.calendarEventRepository
      .createQueryBuilder('event')
      .leftJoin('event.createdBy', 'user')
      .select('user.id', 'userId')
      .addSelect('user.name', 'userName')
      .addSelect('COUNT(*)', 'count')
      .where('event.companyId = :companyId', { companyId })
      .groupBy('user.id, user.name')
      .getRawMany();

    return {
      totalEvents,
      completedEvents,
      upcomingEvents,
      overdueEvents,
      thisMonthEvents,
      eventsByType: eventsByType.map(item => ({
        type: item.type,
        count: parseInt(item.count),
      })),
      eventsByPriority: eventsByPriority.map(item => ({
        priority: item.priority,
        count: parseInt(item.count),
      })),
      eventsByUser: eventsByUser.map(item => ({
        userId: item.userId,
        userName: item.userName,
        count: parseInt(item.count),
      })),
    };
  }

  async addReminder(eventId: string, createReminderDto: CreateCalendarReminderDto, companyId: string) {
    const event = await this.findOneEvent(eventId, companyId);

    const reminder = this.calendarReminderRepository.create({
      ...createReminderDto,
      event: { id: eventId },
    });

    return this.calendarReminderRepository.save(reminder);
  }

  async getEventReminders(eventId: string, companyId: string) {
    await this.findOneEvent(eventId, companyId);

    return this.calendarReminderRepository.find({
      where: { event: { id: eventId } },
      order: { minutesBefore: 'ASC' },
    });
  }

  async removeReminder(reminderId: string, companyId: string) {
    const reminder = await this.calendarReminderRepository.findOne({
      where: { id: reminderId, event: { company: { id: companyId } } },
      relations: ['event'],
    });

    if (!reminder) {
      throw new NotFoundException(`Reminder with ID ${reminderId} not found`);
    }

    await this.calendarReminderRepository.remove(reminder);
    return { id: reminderId, message: 'Reminder deleted successfully' };
  }

  async getCompanyUsers(companyId: string) {
    const users = await this.calendarEventRepository
      .createQueryBuilder('event')
      .leftJoin('event.createdBy', 'user')
      .select([
        'user.id as id',
        'user.name as name', 
        'user.email as email',
        'user.avatar as avatar'
      ])
      .where('event.companyId = :companyId', { companyId })
      .groupBy('user.id, user.name, user.email, user.avatar')
      .getRawMany();

    return users;
  }

  // Utility methods for integration with other modules
  async createEventFromProcess(processId: string, companyId: string, userId: string) {
    // This method can be called when a process deadline is set
    // Implementation would create a calendar event automatically
  }

  async createEventFromContract(contractId: string, companyId: string, userId: string) {
    // This method can be called when a contract deadline is set
    // Implementation would create a calendar event automatically
  }

  async syncProcessDeadlines(companyId: string) {
    // This method can sync process due dates with calendar events
    // Implementation would check for process deadlines and create/update calendar events
  }

  async syncContractDeadlines(companyId: string) {
    // This method can sync contract deadlines with calendar events
    // Implementation would check for contract deadlines and create/update calendar events
  }
}