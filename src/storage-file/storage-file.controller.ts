import { Public } from '@/common/guards/jwt-auth.guard';
import { ApplyResetPasswordDto } from '@/reset-password/dto/apply-reset-password.dto';
import { RequestResetPasswordDto } from '@/reset-password/dto/request-reset-password.dto';
import { ResetPasswordService } from '@/reset-password/reset-password.service';
import { UploadAvatarDto } from '@/storage-file/dto/upload-avatar.dto';
import { StorageFileService } from '@/storage-file/storage-file.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('storage')
@Controller('storage')
export class StorageFileController {
  constructor(private readonly storageFileService: StorageFileService) {}

  @Post('/avatar')
  async uploadAvatar(@Body() { fileName, mimeType }: UploadAvatarDto) {
    const { uploadUrl, publicReadUrl, ACL } =
      await this.storageFileService.getSignedUrlUploadAvatar({
        fileName,
        mimeType,
      });
    return {
      uploadUrl,
      publicReadUrl,
      ACL,
    };
  }
}
