import { TransformStringOnlyNumber } from '@/common/decorators/transform-string-only-number.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsNumberString()
  @TransformStringOnlyNumber()
  @ApiProperty()
  readonly phone: string;

  @IsString()
  @IsUrl()
  @ApiProperty()
  readonly avatarUrl: string;
}
