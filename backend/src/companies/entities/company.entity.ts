import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import { Process } from '../../processes/entities/process.entity';
import { Service } from '../../services/entities/service.entity';
import { DocumentType } from '../../document-types/entities/document-type.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  cnpj: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  logo?: string;

  @OneToMany(() => User, user => user.company)
  users: User[];

  @OneToMany(() => Client, client => client.company)
  clients: Client[];

  @OneToMany(() => Process, process => process.company)
  processes: Process[];

  @OneToMany(() => Service, service => service.company)
  services: Service[];

  @OneToMany(() => DocumentType, documentType => documentType.company)
  documentTypes: DocumentType[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}