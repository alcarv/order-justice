import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientsController } from './controllers/clients.controller';
import { ClientsService } from './services/clients.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    AuthModule,
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [TypeOrmModule, ClientsService],
})
export class ClientsModule {}