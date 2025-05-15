import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Process } from './entities/process.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Process])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ProcessesModule {}