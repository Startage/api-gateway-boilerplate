import { AuthKafkaProviderService } from '@/kafka-provider/auth-kafka-provider/auth-kafka-provider.service';
import { AuthSubscribedTopicsEnum } from '@/kafka-provider/auth-kafka-provider/auth-subscribed-topics.enum';
import {
  ArgumentMetadata,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';

export class ValidationUserEmailPipe implements PipeTransform {
  constructor(private authKafkaProviderService: AuthKafkaProviderService) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const user = await this.authKafkaProviderService.sendAsync(
      AuthSubscribedTopicsEnum.LOAD_USER_BY_EMAIL,
      {
        email: value.email,
      },
    );
    if (user) throw new NotAcceptableException('The email informed is in use');
    return value;
  }
}
