import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentType } from './entities/document-type.entity';
import { DocumentTypesController } from './controllers/document-types.controller';
import { DocumentTypesService } from './services/document-types.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentType]),
    AuthModule,
  ],
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService],
  exports: [TypeOrmModule, DocumentTypesService],
})
export class DocumentTypesModule {}