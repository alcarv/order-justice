import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Service } from './service.entity';
import { User } from '../../users/entities/user.entity';

export enum ClientServiceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('client_services')
export class ClientService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => Service)
  service: Service;

  @Column({
    type: 'enum',
    enum: ClientServiceStatus,
    default: ClientServiceStatus.PENDING
  })
  status: ClientServiceStatus;

  @ManyToOne(() => User)
  assignedTo: User;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}