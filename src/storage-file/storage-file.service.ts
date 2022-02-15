import { KafkaStorageService } from '@/kafka/kafka-storage/kafka-storage.service';
import { StorageSubscribedTopicsEnum } from '@/kafka/kafka-storage/storage-subscribed-topics.enum';
import { UploadAvatarDto } from '@/storage-file/dto/upload-avatar.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageFileService {
  FRONT_URL: string;
  constructor(
    private storageKafkaProviderService: KafkaStorageService,
    private configService: ConfigService,
  ) {
    this.FRONT_URL = this.configService.get('FRONT_URL');
  }

  async getSignedUrlUploadAvatar({
    fileName,
    mimeType,
  }: UploadAvatarDto): Promise<{
    uploadUrl: string;
    publicReadUrl: string;
    ACL: string;
  }> {
    return this.storageKafkaProviderService.sendAsync(
      StorageSubscribedTopicsEnum.SIGNED_URL_UPLOAD_AVATAR,
      {
        fileName,
        mimeType,
      },
    );
  }
}
