import { AuthKafkaProviderService } from '@/kafka-provider/auth-kafka-provider/auth-kafka-provider.service';
import { KafkaProviderModule } from '@/kafka-provider/kafka-provider.module';
import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';

@Module({
  imports: [KafkaProviderModule],
  providers: [ResetPasswordService, AuthKafkaProviderService],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
