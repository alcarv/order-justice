import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { CalendarEvent } from './calendar-event.entity';

export enum CalendarReminderType {
  EMAIL = 'email',
  NOTIFICATION = 'notification',
  SMS = 'sms'
}

@Entity('calendar_reminders')
export class CalendarReminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CalendarEvent, event => event.reminders)
  event: CalendarEvent;

  @Column({
    type: 'enum',
    enum: CalendarReminderType,
    default: CalendarReminderType.NOTIFICATION
  })
  type: CalendarReminderType;

  @Column({ default: 15 })
  minutesBefore: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}