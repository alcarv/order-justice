import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../entities/contract-value.entity';

export class CreateContractValueDto {
  @ApiProperty({ example: 'Initial payment' })
  @IsString()
  description: string;

  @ApiProperty({ example: 5000.00 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2024-02-01', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 'Credit Card', required: false })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.PENDING })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}