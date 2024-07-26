import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum TimeUnit {
  DAY = 'day',
  MONTH = 'month',
  WEEK = 'week',
}

export class getTransactionDto extends PartialType(CreateTransactionDto) {
  @IsString()
  @IsNotEmpty()
  fromDate: string;

  @IsString()
  @IsNotEmpty()
  toDate: string;

  @IsEnum(TimeUnit)
  @IsNotEmpty()
  unit: TimeUnit;
}
