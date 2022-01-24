import { IsEqualTo } from '@/common/decorators/validation-is-equal-to.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ApplyResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty()
  readonly password: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  @ApiProperty()
  passwordConfirmation: string;
}
