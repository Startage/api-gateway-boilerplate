import { AuthModel } from '@/auth/auth.model';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<'string'>('JWT_SECRET'),
    });
  }

  async validate(payload: AuthModel) {
    return {
      userId: payload.userId,
      username: payload.username,
      name: payload.name,
    };
  }
}
