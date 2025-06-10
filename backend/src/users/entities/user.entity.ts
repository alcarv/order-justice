import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { Company } from '../../companies/entities/company.entity';
import { UserSession } from '../../auth/entities/user-session.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER
  })
  role: UserRole;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @ManyToOne(() => Company, company => company.users)
  company: Company;

  @OneToMany(() => UserSession, session => session.user)
  sessions: UserSession[];

  @OneToOne(() => UserSession, { nullable: true })
  @JoinColumn({ name: 'current_session_id' })
  currentSession?: UserSession;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}