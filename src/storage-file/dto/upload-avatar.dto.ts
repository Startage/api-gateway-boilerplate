import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsMimeType, IsNotEmpty, IsString } from 'class-validator';

export class UploadAvatarDto {
  @IsNotEmpty()
  @IsString()
  @IsMimeType()
  @IsIn(['image/jpeg', 'image/png'])
  @ApiProperty()
  readonly mimeType: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fileName: string;
}
