import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Process } from '../../processes/entities/process.entity';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';
import { ContractValue } from './contract-value.entity';
import { ContractHistory } from './contract-history.entity';
import { ContractDocument } from './contract-document.entity';

export enum ContractStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

export enum ContractType {
  SERVICE = 'service',
  RETAINER = 'retainer',
  CONTINGENCY = 'contingency',
  HOURLY = 'hourly',
  FIXED = 'fixed'
}

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ unique: true })
  contractNumber: string;

  @ManyToOne(() => Client, client => client.contracts)
  client: Client;

  @ManyToOne(() => Process, { nullable: true })
  process?: Process;

  @ManyToOne(() => Company, company => company.contracts)
  company: Company;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.DRAFT
  })
  status: ContractStatus;

  @Column({
    type: 'enum',
    enum: ContractType
  })
  contractType: ContractType;

  @Column('decimal', { precision: 15, scale: 2 })
  totalValue: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @ManyToOne(() => User)
  createdBy: User;

  @Column({ type: 'timestamp', nullable: true })
  signedAt?: Date;

  @Column('text', { nullable: true })
  termsAndConditions?: string;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @OneToMany(() => ContractValue, value => value.contract)
  values: ContractValue[];

  @OneToMany(() => ContractHistory, history => history.contract)
  history: ContractHistory[];

  @OneToMany(() => ContractDocument, document => document.contract)
  documents: ContractDocument[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}