// backend/src/processes/processes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Process } from './entities/process.entity';
import { Activity } from './entities/activity.entity';
import { ProcessesController } from './controllers/processes.controller';
import { ProcessesService } from './services/processes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Process, Activity])],
  controllers: [ProcessesController],
  providers: [ProcessesService],
  exports: [TypeOrmModule, ProcessesService],
})
export class ProcessesModule {}
