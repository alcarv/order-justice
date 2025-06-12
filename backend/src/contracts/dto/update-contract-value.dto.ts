import { PartialType } from '@nestjs/swagger';
import { CreateContractValueDto } from './create-contract-value.dto';

export class UpdateContractValueDto extends PartialType(CreateContractValueDto) {}