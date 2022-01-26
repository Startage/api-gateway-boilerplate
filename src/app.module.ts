import { AuthModule } from '@/auth/auth.module';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { KafkaProviderModule } from './kafka-provider/kafka-provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    AuthModule,
    ResetPasswordModule,
    KafkaProviderModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
