import {
  IsOptional,
  IsString,
  IsObject,
  IsNumber,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidateNested,
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
  collectionId?: string;

  @IsString()
  message: string;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => ChatOptionsDto)
  chatOptions?: ChatOptionsDto;
}

export class ContinueChatDto {
  @IsOptional()
  @IsString()
  parentMessageId?: string;

  @IsString()
  collectionId?: string;

  @IsString()
  message: string;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => ChatOptionsDto)
  chatOptions?: ChatOptionsDto;
}
