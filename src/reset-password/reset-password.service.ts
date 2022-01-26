import { AuthKafkaProviderService } from '@/kafka-provider/auth-kafka-provider/auth-kafka-provider.service';
import { AuthSubscribedTopicsEnum } from '@/kafka-provider/auth-kafka-provider/auth-subscribed-topics.enum';
import { AuthUnsubscribedTopicsEnum } from '@/kafka-provider/auth-kafka-provider/auth-unsubscribed-topics.enum';
import { ApplyResetPasswordDto } from '@/reset-password/dto/apply-reset-password.dto';
import { RequestResetPasswordDto } from '@/reset-password/dto/request-reset-password.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResetPasswordService {
  FRONT_URL: string;
  constructor(
    private authKafkaProviderService: AuthKafkaProviderService,
    private configService: ConfigService,
  ) {
    this.FRONT_URL = this.configService.get('FRONT_URL');
  }

  async requestResetPassword({ email }: RequestResetPasswordDto) {
    this.authKafkaProviderService.emit(
      AuthUnsubscribedTopicsEnum.REQUEST_RESET_PASSWORD,
      {
        email,
        baseUrlResetPassword: `${this.FRONT_URL}/auth/reset-password`,
      },
    );
  }

  async applyResetPassword({
    id,
    password,
  }: ApplyResetPasswordDto & {
    id: string;
  }) {
    return this.authKafkaProviderService.sendAsync(
      AuthSubscribedTopicsEnum.APPLY_RESET_PASSWORD,
      {
        id,
        password,
      },
    );
  }
}
