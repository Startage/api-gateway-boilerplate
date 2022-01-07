import {
  ArgumentMetadata,
  Inject,
  NotAcceptableException,
  OnModuleInit,
  PipeTransform,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class ValidationUserEmailPipe implements PipeTransform, OnModuleInit {
  constructor(@Inject('AUTH_KAFKA_SERVICE') private client: ClientKafka) {}

  onModuleInit() {
    const requestPatters = [
      'auth.login',
      'auth.signup',
      'auth.load-user-by-email',
    ];
    requestPatters.forEach(async (pattern) => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect();
    });
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const user = await firstValueFrom(
      this.client.send('auth.load-user-by-email', {
        email: value.email,
      }),
    );
    if (user) throw new NotAcceptableException('The email informed is in use');
    return value;
  }
}
