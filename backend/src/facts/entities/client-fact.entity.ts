import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';
import { Process } from '../../processes/entities/process.entity';

@Entity('client_facts')
export class ClientFact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => User)
  reportedBy: User;

  @Column('text')
  content: string;

  @ManyToOne(() => Process, { nullable: true })
  process?: Process;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}