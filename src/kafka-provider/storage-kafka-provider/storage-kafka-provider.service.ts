import { CustomClientKafka } from '@/common/custom-client-kafka';
import { StorageSubscribedTopicsEnum } from '@/kafka-provider/Storage-kafka-provider/Storage-subscribed-topics.enum';
import { StorageUnsubscribedTopicsEnum } from '@/kafka-provider/Storage-kafka-provider/Storage-unsubscribed-topics.enum';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class StorageKafkaProviderService implements OnModuleInit {
  constructor(
    @Inject('STORAGE_KAFKA_SERVICE') private client: CustomClientKafka,
  ) {}

  async onModuleInit() {
    const requestPatters = Object.values(StorageSubscribedTopicsEnum);
    for await (const pattern of requestPatters) {
      this.client.subscribeToResponseOf(pattern);
    }
    await this.client.connect();
  }

  emit<TResult = any, TInput = any>(
    pattern: StorageSubscribedTopicsEnum | StorageUnsubscribedTopicsEnum,
    data: TInput,
  ): Observable<TResult> {
    return this.client.emit(pattern, data);
  }

  async sendAsync<TResult = any, TInput = any>(
    pattern: StorageSubscribedTopicsEnum | StorageUnsubscribedTopicsEnum,
    data: TInput,
  ): Promise<TResult> {
    return await this.client.sendAsync(pattern, data);
  }
}
