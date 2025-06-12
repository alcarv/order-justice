import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { ContractValue } from './entities/contract-value.entity';
import { ContractHistory } from './entities/contract-history.entity';
import { ContractDocument } from './entities/contract-document.entity';
import { ContractsController } from './controllers/contracts.controller';
import { ContractsService } from './services/contracts.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contract,
      ContractValue,
      ContractHistory,
      ContractDocument
    ]),
    AuthModule,
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [TypeOrmModule, ContractsService],
})
export class ContractsModule {}