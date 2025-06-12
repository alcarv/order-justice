import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientFact } from './entities/client-fact.entity';
import { FactsController } from './controllers/facts.controller';
import { FactsService } from './services/facts.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientFact]),
    AuthModule,
  ],
  controllers: [FactsController],
  providers: [FactsService],
  exports: [TypeOrmModule, FactsService],
})
export class FactsModule {}