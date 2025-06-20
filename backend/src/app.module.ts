import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { ProcessesModule } from './processes/processes.module';
import { ServicesModule } from './services/services.module';
import { FactsModule } from './facts/facts.module';
import { DocumentsModule } from './documents/documents.module';
import { CompaniesModule } from './companies/companies.module';
import { DocumentTypesModule } from './document-types/document-types.module';
import { ContractsModule } from './contracts/contracts.module';
import { CalendarModule } from './calendar/calendar.module';
import { SessionGuard } from './auth/guards/session.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ClientsModule,
    ProcessesModule,
    ServicesModule,
    FactsModule,
    DocumentsModule,
    CompaniesModule,
    DocumentTypesModule,
    ContractsModule,
    CalendarModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
  ],
})
export class AppModule {}