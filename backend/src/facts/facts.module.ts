import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientFact } from './entities/client-fact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientFact])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class FactsModule {}