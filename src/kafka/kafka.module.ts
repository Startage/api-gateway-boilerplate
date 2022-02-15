import { KafkaProviderFactory } from '@/common/provider/kafka-provider-factory';
import { KafkaAuthService } from '@/kafka/kafka-auth/kafka-auth.service';
import { KafkaStorageService } from '@/kafka/kafka-storage/kafka-storage.service';
import { Module } from '@nestjs/common';

const authKafkaProvider = KafkaProviderFactory.create({
  provide: 'AUTH_KAFKA_SERVICE',
  clientId: 'auth',
  groupId: 'auth-consumer',
});
const storageKafkaProvider = KafkaProviderFactory.create({
  provide: 'STORAGE_KAFKA_SERVICE',
  clientId: 'storage',
  groupId: 'storage-consumer',
});

@Module({
  providers: [
    KafkaAuthService,
    KafkaStorageService,
    authKafkaProvider,
    storageKafkaProvider,
  ],
  exports: [KafkaAuthService, KafkaStorageService],
})
export class KafkaModule {}
