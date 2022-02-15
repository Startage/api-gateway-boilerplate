import { ResendConfirmEmailDto } from '@/auth/dto/resend-confirm-email.dto';
import { SignupDto } from '@/auth/dto/signup.dto';
import { UpdateUserPasswordDto } from '@/auth/dto/update-user-password.dto';
import { UpdateUserDto } from '@/auth/dto/update-user.dto';
import { AuthModel } from '@/common/models/auth.model';
import { UserModel } from '@/common/models/user.model';
import { AuthSubscribedTopicsEnum } from '@/kafka/kafka-auth/auth-subscribed-topics.enum';
import { AuthUnsubscribedTopicsEnum } from '@/kafka/kafka-auth/auth-unsubscribed-topics.enum';
import { KafkaAuthService } from '@/kafka/kafka-auth/kafka-auth.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  FRONT_URL: string;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private authKafkaProviderService: KafkaAuthService,
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

  async login({ user, refreshToken }: AuthModel) {
    return {
      accessToken: this.jwtService.sign(user),
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
      accessToken: this.jwtService.sign(validRefreshToken.user),
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

  async loadUserById({ userId }: { userId: string }): Promise<UserModel> {
    return await this.authKafkaProviderService.sendAsync(
      AuthSubscribedTopicsEnum.LOAD_USER_BY_ID,
      {
        userId: userId,
      },
    );
  }

  async updateUserById({
    phone,
    name,
    avatarUrl,
    userId,
  }: UpdateUserDto & { userId: string }): Promise<UserModel> {
    return await this.authKafkaProviderService.sendAsync(
      AuthSubscribedTopicsEnum.UPDATE_USER_BY_ID,
      {
        userId: userId,
        phone,
        name,
        avatarUrl,
      },
    );
  }

  async updateUserPasswordById({
    password,
    currentPassword,
    userId,
  }: Omit<UpdateUserPasswordDto, 'passwordConfirmation'> & {
    userId: string;
  }): Promise<UserModel> {
    return await this.authKafkaProviderService.sendAsync(
      AuthSubscribedTopicsEnum.CHANGE_USER_PASSWORD_BY_ID,
      {
        userId: userId,
        password,
        currentPassword,
      },
    );
  }
}
