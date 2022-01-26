import { AuthModel } from '@/auth/auth.model';
import { ResendConfirmEmailDto } from '@/auth/dto/resend-confirm-email.dto';
import { SignupDto } from '@/auth/dto/signup.dto';
import { AuthKafkaProviderService } from '@/kafka-provider/auth-kafka-provider/auth-kafka-provider.service';
import { AuthSubscribedTopicsEnum } from '@/kafka-provider/auth-kafka-provider/auth-subscribed-topics.enum';
import { AuthUnsubscribedTopicsEnum } from '@/kafka-provider/auth-kafka-provider/auth-unsubscribed-topics.enum';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  FRONT_URL: string;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private authKafkaProviderService: AuthKafkaProviderService,
  ) {
    this.FRONT_URL = this.configService.get('FRONT_URL');
  }

  async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthModel> {
    const authorization = await this.authKafkaProviderService.sendAsync(
      AuthSubscribedTopicsEnum.LOGIN,
      {
        email,
        password,
      },
    );
    return authorization;
  }

  async login({ user, refreshToken }: { user: any; refreshToken: any }) {
    return {
      accessToken: this.jwtService.sign({
        userId: user.id,
      }),
      refreshToken,
    };
  }

  async refreshToken({ refreshTokenId }: { refreshTokenId: string }): Promise<{
    accessToken;
  }> {
    const validRefreshToken = await this.authKafkaProviderService.sendAsync(
      AuthSubscribedTopicsEnum.LOAD_VALID_REFRESH_TOKEN,
      {
        refreshTokenId,
      },
    );
    if (!validRefreshToken) return null;
    return {
      accessToken: this.jwtService.sign({
        userId: validRefreshToken.userId,
      }),
    };
  }

  async signup({ email, name, password, phone }: SignupDto) {
    await this.authKafkaProviderService.sendAsync(
      AuthSubscribedTopicsEnum.SIGNUP,
      {
        email,
        name,
        password,
        phone,
        baseUrlConfirmation: `${this.FRONT_URL}/auth/confirm-email`,
      },
    );
  }

  async resendSignupConfirmEmail({ email }: ResendConfirmEmailDto) {
    await this.authKafkaProviderService.emit(
      AuthUnsubscribedTopicsEnum.RESEND_SIGNUP_CONFIRM_EMAIL,
      {
        email,
        baseUrlConfirmation: `${this.FRONT_URL}/auth/confirm-email`,
      },
    );
  }

  async signupConfirmEmail({ confirmToken }: { confirmToken: string }) {
    await this.authKafkaProviderService.sendAsync(
      AuthSubscribedTopicsEnum.SIGNUP_CONFIRM_EMAIL,
      {
        confirmToken,
      },
    );
  }
}
