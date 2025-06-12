import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract.entity';
import { User } from '../../users/entities/user.entity';

@Entity('contract_history')
export class ContractHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Contract, contract => contract.history)
  contract: Contract;

  @Column()
  action: string;

  @Column('text')
  description: string;

  @Column('jsonb', { nullable: true })
  oldValues?: Record<string, any>;

  @Column('jsonb', { nullable: true })
  newValues?: Record<string, any>;

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;
}