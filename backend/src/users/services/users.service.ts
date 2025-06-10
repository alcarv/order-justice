import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Company } from '../../companies/entities/company.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { SessionService } from '../../auth/services/session.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private sessionService: SessionService,
  ) {}

  async findAll(companyId: string) {
    return this.usersRepository.find({
      where: { company: { id: companyId } },
      select: ['id', 'name', 'email', 'role', 'avatar', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
      order: { name: 'ASC' },
      relations: ['currentSession'],
    });
  }

  async findOne(id: string, companyId: string) {
    const user = await this.usersRepository.findOne({
      where: { id, company: { id: companyId } },
      select: ['id', 'name', 'email', 'role', 'avatar', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
      relations: ['currentSession'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ 
      where: { email },
      relations: ['company'],
    });
  }

  async create(createUserDto: CreateUserDto, companyId: string) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const activeUsers = await this.usersRepository.count({
      where: { company: { id: companyId }, isActive: true },
    });

    if (activeUsers >= company.licenseLimit) {
      throw new ForbiddenException(
        `Cannot create user. Company has reached its license limit of ${company.licenseLimit} users.`
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      company: { id: companyId },
      isActive: true,
    });
    
    const savedUser = await this.usersRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto, companyId: string, requesterId: string) {
    const user = await this.findOne(id, companyId);
    
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (id === requesterId && updateUserDto.role) {
      throw new ForbiddenException('You cannot change your own role');
    }
    
    Object.assign(user, updateUserDto);
    const savedUser = await this.usersRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  async remove(id: string, companyId: string, requesterId: string) {
    const user = await this.findOne(id, companyId);
    
    if (id === requesterId) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    if (user.currentSession) {
      await this.sessionService.deactivateUserSessions(id);
    }

    await this.usersRepository.remove(user);
    return { id, message: 'User deleted successfully' };
  }

  async toggleStatus(id: string, companyId: string, requesterId: string) {
    const user = await this.findOne(id, companyId);
    
    if (id === requesterId) {
      throw new ForbiddenException('You cannot deactivate your own account');
    }

    const newStatus = !user.isActive;

    if (!newStatus && user.currentSession) {
      await this.sessionService.deactivateUserSessions(id);
    }

    await this.usersRepository.update(id, { isActive: newStatus });
    
    const updatedUser = await this.findOne(id, companyId);
    return {
      ...updatedUser,
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`
    };
  }

  async getCompanyStats(companyId: string) {
    const totalUsers = await this.usersRepository.count({
      where: { company: { id: companyId } },
    });

    const activeUsers = await this.usersRepository.count({
      where: { company: { id: companyId }, isActive: true },
    });

    const loggedInUsers = await this.usersRepository.count({
      where: { 
        company: { id: companyId }, 
        isActive: true,
        currentSession: { isActive: true }
      },
      relations: ['currentSession'],
    });

    return {
      totalUsers,
      activeUsers,
      loggedInUsers,
      inactiveUsers: totalUsers - activeUsers,
    };
  }
}