import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

export enum DocumentTypeEnum {
  CPF = 'CPF',
  RG = 'RG',
  CNH = 'CNH',
  CERTIDAO_NASCIMENTO = 'Certidao_Nascimento',
  CERTIDAO_CASAMENTO = 'Certidao_Casamento',
  COMPROVANTE_RESIDENCIA = 'Comprovante_Residencia',
  PROCURACAO = 'Procuracao',
  CONTRATO = 'Contrato',
  PETICAO = 'Peticao',
  DECISAO = 'Decisao',
  OUTROS = 'Outros'
}

@Entity('document_types')
export class DocumentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DocumentTypeEnum
  })
  type: DocumentTypeEnum;

  @Column()
  label: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Company, company => company.documentTypes)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}