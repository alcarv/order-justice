import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(companyId: string) {
    return this.usersRepository.find({
      where: { company: { id: companyId } },
      select: ['id', 'name', 'email', 'role', 'avatar', 'createdAt', 'updatedAt'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, companyId: string) {
    const user = await this.usersRepository.findOne({
      where: { id, company: { id: companyId } },
      select: ['id', 'name', 'email', 'role', 'avatar', 'createdAt', 'updatedAt'],
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

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      company: { id: companyId },
    });
    
    const savedUser = await this.usersRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto, companyId: string) {
    const user = await this.findOne(id, companyId);
    
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }
    
    Object.assign(user, updateUserDto);
    const savedUser = await this.usersRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  async remove(id: string, companyId: string) {
    const user = await this.findOne(id, companyId);
    await this.usersRepository.remove(user);
    return { id };
  }
}