import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ClientServiceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class UpdateServiceStatusDto {
  @ApiProperty({ enum: ClientServiceStatus })
  @IsEnum(ClientServiceStatus)
  status: ClientServiceStatus;
}