import { AuthModel } from '@/auth/auth.model';
import { AuthService } from '@/auth/auth.service';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  logger = new Logger(LocalStrategy.name);
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<AuthModel['user']> {
    let authorization;
    try {
      authorization = await this.authService.validateUser({
        email,
        password,
      });
    } catch (err) {
      if (err.name === 'EmailIsNotConfirmedError') {
        throw new NotAcceptableException();
      }
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
    if (!authorization) {
      throw new UnauthorizedException();
    }
    return authorization;
  }
}
