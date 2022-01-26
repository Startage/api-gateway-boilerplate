import { CustomClientKafka } from '@/common/custom-client-kafka';
import { AuthSubscribedTopicsEnum } from '@/kafka-provider/auth-kafka-provider/auth-subscribed-topics.enum';
import { AuthUnsubscribedTopicsEnum } from '@/kafka-provider/auth-kafka-provider/auth-unsubscribed-topics.enum';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthKafkaProviderService implements OnModuleInit {
  constructor(
    @Inject('AUTH_KAFKA_SERVICE') private client: CustomClientKafka,
  ) {}

  async onModuleInit() {
    const requestPatters = Object.values(AuthSubscribedTopicsEnum);
    for await (const pattern of requestPatters) {
      this.client.subscribeToResponseOf(pattern);
    }
    await this.client.connect();
  }

  emit<TResult = any, TInput = any>(
    pattern: AuthSubscribedTopicsEnum | AuthUnsubscribedTopicsEnum,
    data: TInput,
  ): Observable<TResult> {
    return this.client.emit(pattern, data);
  }

  async sendAsync<TResult = any, TInput = any>(
    pattern: AuthSubscribedTopicsEnum | AuthUnsubscribedTopicsEnum,
    data: TInput,
  ): Promise<TResult> {
    return await this.client.sendAsync(pattern, data);
  }
}
