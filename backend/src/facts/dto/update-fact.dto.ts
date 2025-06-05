import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFactDto {
  @ApiProperty({ example: 'Updated content about the client situation' })
  @IsString()
  content: string;
}