import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '../entities/user-session.entity';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectRepository(UserSession)
    private sessionRepository: Repository<UserSession>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No valid authorization token provided');
    }

    const token = authHeader.substring(7);
    
    try {
      const payload = this.jwtService.verify(token);
      
      const sessionId = payload.sessionId;
      if (!sessionId) {
        throw new UnauthorizedException('Session ID not found in token');
      }

      const session = await this.sessionRepository.findOne({
        where: { 
          id: sessionId, 
          isActive: true 
        },
        relations: ['user', 'user.company'],
      });

      if (!session) {
        throw new UnauthorizedException('Session is no longer active');
      }

      if (session.expiresAt < new Date()) {
        await this.sessionRepository.update(sessionId, { 
          isActive: false 
        });
        throw new UnauthorizedException('Session has expired');
      }

      await this.sessionRepository.update(sessionId, {
        lastActivity: new Date(),
      });

      request.user = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        name: session.user.name,
        companyId: session.user.company?.id,
        sessionId: session.id,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}