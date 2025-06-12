import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Process } from './entities/process.entity';
import { Activity } from './entities/activity.entity';
import { ProcessesController } from './controllers/processes.controller';
import { ProcessesService } from './services/processes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Process, Activity]),
    AuthModule,
  ],
  controllers: [ProcessesController],
  providers: [ProcessesService],
  exports: [TypeOrmModule, ProcessesService],
})
export class ProcessesModule {}