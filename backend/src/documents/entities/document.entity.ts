import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Process } from '../../processes/entities/process.entity';
import { User } from '../../users/entities/user.entity';
import { DocumentType } from '../../document-types/entities/document-type.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Process, process => process.documents)
  process: Process;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  fileUrl: string;

  @Column()
  fileType: string;

  @Column('bigint')
  fileSize: number;

  @ManyToOne(() => User)
  uploadedBy: User;

  @Column({ type: 'timestamp' })
  uploadedAt: Date;

  @ManyToOne(() => DocumentType, { nullable: true })
  documentType: DocumentType;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}