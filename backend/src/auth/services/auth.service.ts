import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ 
      where: { email },
      relations: ['company'],
    });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: userPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      companyId: user.company?.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto, companyId?: string) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const userData = {
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
    };

    const user = this.usersRepository.create(userData);
    
    if (companyId) {
      user.company = { id: companyId } as any;
    }

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
}