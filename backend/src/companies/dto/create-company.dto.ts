import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Legal Corp' })
  @IsString()
  name: string;

  @ApiProperty({ example: '12.345.678/0001-90' })
  @IsString()
  cnpj: string;

  @ApiProperty({ example: '123 Main St, City, State' })
  @IsString()
  address: string;

  @ApiProperty({ example: '+55 11 1234-5678' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'contact@legalcorp.com' })
  @IsEmail()
  email: string;
}