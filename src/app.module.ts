import { AuthModule } from '@/auth/auth.module';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { KafkaModule } from '@/kafka/kafka.module';
import { StorageFileModule } from '@/storage-file/storage-file.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ResetPasswordModule } from './reset-password/reset-password.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    AuthModule,
    ResetPasswordModule,
    StorageFileModule,
    KafkaModule,
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
