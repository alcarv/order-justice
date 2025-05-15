import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ClientService } from './entities/client-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ClientService])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ServicesModule {}