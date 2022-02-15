import { AuthSubscribedTopicsEnum } from '@/kafka/kafka-auth/auth-subscribed-topics.enum';
import { KafkaAuthService } from '@/kafka/kafka-auth/kafka-auth.service';
import {
  ArgumentMetadata,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';

export class ValidationPendingConfirmEmailPipe implements PipeTransform {
  constructor(private authKafkaProviderService: KafkaAuthService) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const user = await this.authKafkaProviderService.sendAsync(
      AuthSubscribedTopicsEnum.LOAD_USER_BY_EMAIL,
      {
        email: value.email,
      },
    );
    if (user.isConfirmedEmail)
      throw new NotAcceptableException('The email is confirmed');
    return value;
  }
}
