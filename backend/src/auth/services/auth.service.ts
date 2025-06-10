import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ 
      where: { email, isActive: true },
      relations: ['company'],
    });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: userPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User account is deactivated');
    }

    try {
      const { sessionToken, accessToken } = await this.sessionService.createSession(
        user,
        ipAddress,
        userAgent
      );

      return {
        access_token: accessToken,
        session_token: sessionToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          company: user.company,
        },
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Login failed');
    }
  }

  async logout(sessionToken: string): Promise<void> {
    const session = await this.sessionService.validateSession(sessionToken);
    if (session) {
      const user = await this.usersRepository.findOne({
        where: { id: session.id },
        relations: ['currentSession'],
      });
      
      if (user?.currentSession) {
        await this.sessionService.deactivateSession(user.currentSession.id);
      }
    }
  }

  async register(registerDto: RegisterDto, companyId?: string) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    if (!companyId) {
      throw new ForbiddenException('Company ID is required for user registration');
    }

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new ForbiddenException('Company not found');
    }

    const activeUsers = await this.usersRepository.count({
      where: { company: { id: companyId }, isActive: true },
    });

    if (activeUsers >= company.licenseLimit) {
      throw new ForbiddenException(
        `Cannot create user. Company has reached its license limit of ${company.licenseLimit} users.`
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const userData = {
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
      isActive: true,
    };

    const user = this.usersRepository.create(userData);
    user.company = { id: companyId } as any;

    const savedUser = await this.usersRepository.save(user);
    
    const { password: userPassword, ...result } = savedUser;
    
    const payload = { 
      email: result.email, 
      sub: result.id, 
      role: result.role,
      companyId: companyId,
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }

  async validateSession(sessionToken: string): Promise<User | null> {
    return this.sessionService.validateSession(sessionToken);
  }

  async getCompanyLicenseInfo(companyId: string) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new UnauthorizedException('Company not found');
    }

    const activeSessions = await this.sessionService.getActiveSessions(companyId);
    
    return {
      licenseLimit: company.licenseLimit,
      licenseUsed: company.licenseUsed,
      activeSessions: activeSessions.map(session => ({
        id: session.id,
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        },
        lastActivity: session.lastActivity,
        ipAddress: session.ipAddress,
      })),
    };
  }

  async forceLogoutUser(adminUserId: string, targetUserId: string): Promise<void> {
    // Verify admin has permission (same company)
    const adminUser = await this.usersRepository.findOne({
      where: { id: adminUserId },
      relations: ['company'],
    });

    const targetUser = await this.usersRepository.findOne({
      where: { id: targetUserId },
      relations: ['company'],
    });

    if (!adminUser || !targetUser || adminUser.company.id !== targetUser.company.id) {
      throw new ForbiddenException('Insufficient permissions');
    }

    await this.sessionService.deactivateUserSessions(targetUserId);
  }
}