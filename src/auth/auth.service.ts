import { AuthModel } from '@/auth/auth.model';
import { SignupDto } from '@/auth/dto/signup.dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private jwtService: JwtService,
    @Inject('AUTH_KAFKA_SERVICE') private client: ClientKafka,
  ) {}

  onModuleInit() {
    const requestPatters = ['auth.login', 'auth.signup'];
    requestPatters.forEach(async (pattern) => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect();
    });
  }

  async validateUser({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<AuthModel> {
    const user = {
      username: 'admin',
      name: 'admin',
      id: 'f82b1098-4329-4ef2-b20e-92ee30398439',
      password: '$2b$12$Jb.JfqgAMO84LtCULnBGE.SoFol9vzNE0z0X3n96MJ7r1clIn2O.y',
      createdAt: new Date(),
    };
    if (user) {
      const { password: hashedPassword, id: userId, ...result } = user;
      const isValidPassword = await bcrypt.compare(password, hashedPassword);
      if (isValidPassword)
        return {
          ...result,
          userId,
        };
    }
    return null;
  }

  async login(user: AuthModel) {
    const payload: AuthModel = {
      username: user.username,
      userId: user.userId,
      name: user.name,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      name: user.name,
    };
  }

  async signup({ email, name, password, phone }: SignupDto) {
    await firstValueFrom(
      this.client.send('auth.signup', {
        email,
        name,
        password,
        phone,
      }),
    );
  }
}
