import { KafkaProviderModule } from '@/kafka-provider/kafka-provider.module';
import { StorageKafkaProviderService } from '@/kafka-provider/storage-kafka-provider/storage-kafka-provider.service';
import { StorageFileController } from '@/storage-file/storage-file.controller';
import { StorageFileService } from '@/storage-file/storage-file.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [KafkaProviderModule],
  providers: [StorageFileService, StorageKafkaProviderService],
  controllers: [StorageFileController],
})
export class StorageFileModule {}
