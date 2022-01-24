import { TransformStringLowerCase } from '@/common/decorators/transform-string-lower-case.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsLowercase, IsNotEmpty, IsString } from 'class-validator';

export class RequestResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsLowercase()
  @TransformStringLowerCase()
  @ApiProperty()
  readonly email: string;
}
