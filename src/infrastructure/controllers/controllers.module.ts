/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { GenerateQrController } from './generate-qr/generate-qr.controller';
import { PaymentProviderController } from './payment-provider/payment-provider.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [GenerateQrController, PaymentProviderController],
})
export class ControllersModule {};