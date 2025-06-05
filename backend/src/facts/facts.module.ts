import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientFact } from './entities/client-fact.entity';
import { FactsController } from './controllers/facts.controller';
import { FactsService } from './services/facts.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientFact])],
  controllers: [FactsController],
  providers: [FactsService],
  exports: [TypeOrmModule, FactsService],
})
export class FactsModule {}