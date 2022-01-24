import { AuthModel } from '@/auth/auth.model';
import { ResendConfirmEmailDto } from '@/auth/dto/resend-confirm-email.dto';
import { SignupDto } from '@/auth/dto/signup.dto';
import { CustomClientKafka } from '@/common/custom-client-kafka';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnModuleInit {
  FRONT_URL: string;
  constructor(
    private jwtService: JwtService,
    @Inject('AUTH_KAFKA_SERVICE') private client: CustomClientKafka,
    private configService: ConfigService,
  ) {
    this.FRONT_URL = this.configService.get('FRONT_URL');
  }

  async onModuleInit() {
    const requestPatters = [
      'auth.login',
      'auth.signup',
      'auth.signup-confirm-email',
    ];
    for await (const pattern of requestPatters) {
      this.client.subscribeToResponseOf(pattern);
    }
    await this.client.connect();
  }

  async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthModel> {
    const authorization = await this.client.sendAsync('auth.login', {
      email,
      password,
    });
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
    const validRefreshToken = await this.client.sendAsync(
      'auth.load-valid-refresh-token',
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
    await this.client.sendAsync('auth.signup', {
      email,
      name,
      password,
      phone,
      baseUrlConfirmation: `${this.FRONT_URL}/auth/confirm-email`,
    });
  }

  async resendSignupConfirmEmail({ email }: ResendConfirmEmailDto) {
    await this.client.emit('auth.resend-signup-confirm-email', {
      email,
      baseUrlConfirmation: `${this.FRONT_URL}/auth/confirm-email`,
    });
  }

  async signupConfirmEmail({ confirmToken }: { confirmToken: string }) {
    await this.client.sendAsync('auth.signup-confirm-email', {
      confirmToken,
    });
  }
}
