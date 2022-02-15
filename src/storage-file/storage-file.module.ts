import { KafkaModule } from '@/kafka/kafka.module';
import { StorageFileController } from '@/storage-file/storage-file.controller';
import { StorageFileService } from '@/storage-file/storage-file.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [KafkaModule],
  providers: [StorageFileService],
  controllers: [StorageFileController],
})
export class StorageFileModule {}
