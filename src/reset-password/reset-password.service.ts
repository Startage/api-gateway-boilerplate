import { CustomClientKafka } from '@/common/custom-client-kafka';
import { ApplyResetPasswordDto } from '@/reset-password/dto/apply-reset-password.dto';
import { RequestResetPasswordDto } from '@/reset-password/dto/request-reset-password.dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResetPasswordService implements OnModuleInit {
  FRONT_URL: string;
  constructor(
    @Inject('AUTH_KAFKA_SERVICE') private client: CustomClientKafka,
    private configService: ConfigService,
  ) {
    this.FRONT_URL = this.configService.get('FRONT_URL');
  }

  async onModuleInit() {
    const requestPatters = ['auth.apply-reset-password'];
    for await (const pattern of requestPatters) {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect();
    }
  }

  async requestResetPassword({ email }: RequestResetPasswordDto) {
    await this.client.emit('auth.request-reset-password', {
      email,
      baseUrlResetPassword: `${this.FRONT_URL}/auth/reset-password`,
    });
  }

  async applyResetPassword({
    id,
    password,
  }: ApplyResetPasswordDto & {
    id: string;
  }) {
    return this.client.sendAsync('auth.apply-reset-password', {
      id,
      password,
    });
  }
}
