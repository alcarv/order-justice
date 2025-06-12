import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Process } from '../../processes/entities/process.entity';
import { Contract } from '../../contracts/entities/contract.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  taxId?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  avatar?: string;

  @ManyToOne(() => Company, company => company.clients, { nullable: false })
  company: Company;

  @OneToMany(() => Process, process => process.client)
  processes: Process[];

  @OneToMany(() => Contract, contract => contract.client)
  contracts: Contract[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}