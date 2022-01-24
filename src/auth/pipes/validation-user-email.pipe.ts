import { CustomClientKafka } from '@/common/custom-client-kafka';
import {
  ArgumentMetadata,
  Inject,
  NotAcceptableException,
  OnModuleInit,
  PipeTransform,
} from '@nestjs/common';

export class ValidationUserEmailPipe implements PipeTransform, OnModuleInit {
  constructor(
    @Inject('AUTH_KAFKA_SERVICE') private client: CustomClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('auth.load-user-by-email');
    await this.client.connect();
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const user = await this.client.sendAsync('auth.load-user-by-email', {
      email: value.email,
    });
    if (user) throw new NotAcceptableException('The email informed is in use');
    return value;
  }
}
