import { TransformStringLowerCase } from '@/common/decorators/transform-string-lower-case.decorator';
import { TransformStringOnlyNumber } from '@/common/decorators/transform-string-only-number.decorator';
import { IsEqualTo } from '@/common/decorators/validation-is-equal-to.decorator';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsLowercase()
  @TransformStringLowerCase()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  passwordConfirmation: string;

  @IsNotEmpty()
  @IsNumberString()
  @TransformStringOnlyNumber()
  readonly phone: string;
}
