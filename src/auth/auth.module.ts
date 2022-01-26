import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@/auth/strategies/local.strategy';
import { AuthKafkaProviderService } from '@/kafka-provider/auth-kafka-provider/auth-kafka-provider.service';
import { KafkaProviderModule } from '@/kafka-provider/kafka-provider.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(configService.get('JWT_EXPIRES_IN', '3600')),
        },
      }),
      inject: [ConfigService],
    }),
    KafkaProviderModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AuthKafkaProviderService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
