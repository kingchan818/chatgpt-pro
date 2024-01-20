import {
  IsOptional,
  IsString,
  IsObject,
  IsNumber,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'IsNotEmptyObject', async: false })
export class IsNotEmptyObject implements ValidatorConstraintInterface {
  validate(value: any) {
    return value && typeof value === 'object' && Object.keys(value).length > 0;
  }

  defaultMessage(args) {
    return `Text (${args.property}) must have the required properties`;
  }
}
export class ChatOptionsDto {
  @IsIn([
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-0301',
    'gpt-3.5-turbo-0613',
    'gpt-3.5-turbo-1106',
    'gpt-3.5-turbo-16k',
    'gpt-3.5-turbo-16k-0613',
    'gpt-4',
    'gpt-4-0314',
    'gpt-4-0613',
    'gpt-4-32k',
    'gpt-4-32k-0314',
    'gpt-4-32k-0613',
    'gpt-4-1106-preview',
  ])
  model: string;

  @IsOptional()
  @IsString()
  systemMessage?: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;
}

export class ChatDto {
  @IsOptional()
  @IsString()
  parentMessageId?: string;

  @IsString()
  message: string;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => ChatOptionsDto)
  chatOptions?: ChatOptionsDto;
}
