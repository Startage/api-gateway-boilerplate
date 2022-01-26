import { KafkaProviderFactory } from '@/common/provider/kafka-provider-factory';
import { Module } from '@nestjs/common';
import { AuthKafkaProviderService } from './auth-kafka-provider/auth-kafka-provider.service';

const authKafkaProvider = KafkaProviderFactory.create({
  provide: 'AUTH_KAFKA_SERVICE',
  clientId: 'auth',
  groupId: 'auth-consumer',
});

@Module({
  providers: [AuthKafkaProviderService, authKafkaProvider],
  exports: [AuthKafkaProviderService, authKafkaProvider],
})
export class KafkaProviderModule {}
