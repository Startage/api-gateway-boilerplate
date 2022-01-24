import { KafkaProviderFactory } from '@/common/provider/kafka-provider-factory';
import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';

@Module({
  providers: [
    ResetPasswordService,
    KafkaProviderFactory.create({
      provide: 'AUTH_KAFKA_SERVICE',
      clientId: 'auth',
      groupId: 'auth-consumer',
    }),
  ],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
