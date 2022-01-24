import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

export class CustomClientKafka extends ClientKafka {
  async sendAsync<TResult = any, TInput = any>(
    pattern: any,
    data: TInput,
  ): Promise<TResult> {
    const result = await firstValueFrom(super.send(pattern, data));
    if (result?.hasError) {
      const error = new Error();
      if (result.error) {
        const resultError = JSON.parse(result.error);
        error.name = resultError?.name;
        error.message = resultError?.message;
      }
      throw error;
    }
    return result;
  }
}
