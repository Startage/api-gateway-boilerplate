import { TransformStringLowerCase } from '@/common/decorators/transform-string-lower-case.decorator';
import { TransformStringOnlyNumber } from '@/common/decorators/transform-string-only-number.decorator';
import { IsEqualTo } from '@/common/decorators/validation-is-equal-to.decorator';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty()
  readonly password: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  @ApiProperty()
  passwordConfirmation: string;

  @IsNotEmpty()
  @IsNumberString()
  @TransformStringOnlyNumber()
  @ApiProperty()
  readonly phone: string;
}
