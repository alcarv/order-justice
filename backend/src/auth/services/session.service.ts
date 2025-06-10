import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserSession } from '../entities/user-session.entity';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';
import * as crypto from 'crypto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(UserSession)
    private sessionRepository: Repository<UserSession>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private jwtService: JwtService,
  ) {}

  async createSession(
    user: User, 
    ipAddress?: string, 
    userAgent?: string
  ): Promise<{ sessionToken: string; accessToken: string }> {
    const existingSession = await this.sessionRepository.findOne({
      where: { user: { id: user.id }, isActive: true },
    });

    if (existingSession) {
      throw new ForbiddenException('User already has an active session. Please logout from other devices first.');
    }

    const company = await this.companyRepository.findOne({
      where: { id: user.company.id },
    });

    if (!company) {
      throw new UnauthorizedException('Company not found');
    }

    const activeSessions = await this.sessionRepository.count({
      where: { 
        user: { company: { id: company.id } },
        isActive: true 
      },
    });

    if (activeSessions >= company.licenseLimit) {
      throw new ForbiddenException(
        `License limit reached. Your company has ${company.licenseLimit} licenses and all are currently in use.`
      );
    }

    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const session = this.sessionRepository.create({
      user,
      sessionToken,
      ipAddress,
      userAgent,
      expiresAt,
      isActive: true,
    });

    const savedSession = await this.sessionRepository.save(session);

    await this.userRepository.update(user.id, {
      currentSession: savedSession,
      lastLogin: new Date(),
    });

    await this.companyRepository.update(company.id, {
      licenseUsed: activeSessions + 1,
    });

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      companyId: user.company.id,
      sessionId: savedSession.id,
    };

    const accessToken = this.jwtService.sign(payload);

    return { sessionToken, accessToken };
  }

  async validateSession(sessionToken: string): Promise<User | null> {
    const session = await this.sessionRepository.findOne({
      where: { sessionToken, isActive: true },
      relations: ['user', 'user.company'],
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      await this.deactivateSession(session.id);
      return null;
    }

    await this.sessionRepository.update(session.id, {
      lastActivity: new Date(),
    });

    return session.user;
  }

  async deactivateSession(sessionId: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['user', 'user.company'],
    });

    if (!session) {
      return;
    }

    await this.sessionRepository.update(sessionId, {
      isActive: false,
    });

    await this.userRepository.update(session.user.id, {
      currentSession: null,
    });

    const activeSessions = await this.sessionRepository.count({
      where: { 
        user: { company: { id: session.user.company.id } },
        isActive: true 
      },
    });

    await this.companyRepository.update(session.user.company.id, {
      licenseUsed: activeSessions,
    });
  }

  async deactivateUserSessions(userId: string): Promise<void> {
    const sessions = await this.sessionRepository.find({
      where: { user: { id: userId }, isActive: true },
      relations: ['user', 'user.company'],
    });

    if (sessions.length === 0) {
      return;
    }

    await this.sessionRepository.update(
      { user: { id: userId }, isActive: true },
      { isActive: false }
    );

    await this.userRepository.update(userId, {
      currentSession: null,
    });

    const companyId = sessions[0].user.company.id;
    const activeSessions = await this.sessionRepository.count({
      where: { 
        user: { company: { id: companyId } },
        isActive: true 
      },
    });

    await this.companyRepository.update(companyId, {
      licenseUsed: activeSessions,
    });
  }

  async getActiveSessions(companyId: string): Promise<UserSession[]> {
    return this.sessionRepository.find({
      where: { 
        user: { company: { id: companyId } },
        isActive: true 
      },
      relations: ['user'],
      order: { lastActivity: 'DESC' },
    });
  }

  async cleanupExpiredSessions(): Promise<void> {
    const expiredSessions = await this.sessionRepository.find({
      where: { isActive: true },
      relations: ['user', 'user.company'],
    });

    const now = new Date();
    const expiredSessionIds: string[] = [];
    const companyUpdates: Map<string, number> = new Map();

    for (const session of expiredSessions) {
      if (session.expiresAt < now) {
        expiredSessionIds.push(session.id);
        
        const companyId = session.user.company.id;
        const currentCount = companyUpdates.get(companyId) || 0;
        companyUpdates.set(companyId, currentCount + 1);
      }
    }

    if (expiredSessionIds.length > 0) {
      await this.sessionRepository.update(
        expiredSessionIds,
        { isActive: false }
      );

      await this.userRepository.update(
        { currentSession: { id: { $in: expiredSessionIds } } as any },
        { currentSession: null }
      );

      for (const [companyId, expiredCount] of companyUpdates) {
        const company = await this.companyRepository.findOne({
          where: { id: companyId },
        });
        
        if (company) {
          await this.companyRepository.update(companyId, {
            licenseUsed: Math.max(0, company.licenseUsed - expiredCount),
          });
        }
      }
    }
  }

  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}