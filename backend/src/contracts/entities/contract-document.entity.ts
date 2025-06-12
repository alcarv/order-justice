import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract.entity';
import { User } from '../../users/entities/user.entity';

export enum ContractDocumentType {
  CONTRACT = 'contract',
  AMENDMENT = 'amendment',
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  OTHER = 'other'
}

@Entity('contract_documents')
export class ContractDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Contract, contract => contract.documents)
  contract: Contract;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column()
  fileUrl: string;

  @Column()
  fileType: string;

  @Column('bigint')
  fileSize: number;

  @Column({
    type: 'enum',
    enum: ContractDocumentType,
    default: ContractDocumentType.OTHER
  })
  documentType: ContractDocumentType;

  @ManyToOne(() => User)
  uploadedBy: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}