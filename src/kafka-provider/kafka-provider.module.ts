import { KafkaProviderFactory } from '@/common/provider/kafka-provider-factory';
import { StorageKafkaProviderService } from '@/kafka-provider/storage-kafka-provider/storage-kafka-provider.service';
import { Module } from '@nestjs/common';
import { AuthKafkaProviderService } from './auth-kafka-provider/auth-kafka-provider.service';

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
    AuthKafkaProviderService,
    StorageKafkaProviderService,
    authKafkaProvider,
    storageKafkaProvider,
  ],
  exports: [
    AuthKafkaProviderService,
    StorageKafkaProviderService,
    authKafkaProvider,
    storageKafkaProvider,
  ],
})
export class KafkaProviderModule {}
