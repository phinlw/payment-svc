import { Controller, Post, Body, HttpCode, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { NotifyPaymentUsecase } from '@usecases/generate-qr.usecase';
import {
  NotifyPaymentRequest,
  NotifyPaymentResponse,
} from '@domain/models/generate-qr.model';

@Controller()
export class NotifyPaymentController {
  constructor(
    @Inject(UsecasesProxyModule.POST_NOTIFY_PAYMENT_GENERATE_QR_USECASE_PROXY)
    private readonly notifyPaymentUsecaseProxy: UseCaseProxy<NotifyPaymentUsecase>,
  ) {}

  @Post('notify-payment')
  @HttpCode(200)
  async notifyPayment(
    @Body() params: NotifyPaymentRequest,
  ): Promise<NotifyPaymentResponse> {
    try {
      const result = await this.notifyPaymentUsecaseProxy
        .getInstance()
        .execute(params);
      return result;
    } catch (error) {
      const message = error?.message || String(error);
      throw new HttpException(
        { code: 400, status: 'ERROR', message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
