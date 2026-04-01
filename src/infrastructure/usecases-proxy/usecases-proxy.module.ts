/* eslint-disable prettier/prettier */
import { DynamicModule, Module } from '@nestjs/common';
import { PaymentProviderUsecaseProxy } from './payment-provider.usecase.proxy';
import { GenerateQrUsecaseProxy } from './generate-qr.usecase.proxy';
import { LoggerModule } from '../logger/logger.module';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { RepositoriesModule } from '../repositories/repositories.module';

@Module({
  imports: [LoggerModule, EnvironmentConfigModule, RepositoriesModule],
})
export class UsecasesProxyModule {
  // generate-qr
  static POST_CREATE_GENERATE_RQ_USECASE_PROXY = 'createGenerateQrUsecaseProxy';
  static POST_UPDATE_GENERATE_RQ_USECASE_PROXY = 'updateGenerateQrUsecaseProxy';
  static POST_DELETE_GENERATE_RQ_USECASE_PROXY = 'deleteGenerateQrUsecaseProxy';
  static POST_LOAD_ALL_GENERATE_RQ_USECASE_PROXY = 'loadAllGenerateQrUsecaseProxy';
  static POST_LOAD_BY_ID_GENERATE_RQ_USECASE_PROXY = 'loadGenerateQrByIdUsecaseProxy';
  static POST_GENERATE_QR_USECASE_PROXY = 'generateQrUsecaseProxy';
  // payment-provider
  static POST_CREATE_PAYMENT_PROVIDER_USECASE_PROXY = 'createPaymentProviderUsecaseProxy';
  static POST_UPDATE_PAYMENT_PROVIDER_USECASE_PROXY = 'updatePaymentProviderUsecaseProxy';
  static POST_DELETE_PAYMENT_PROVIDER_USECASE_PROXY = 'deletePaymentProviderUsecaseProxy';
  static POST_LOAD_ALL_PAYMENT_PROVIDER_USECASE_PROXY = 'loadAllPaymentProviderUsecaseProxy';
  static POST_LOAD_BY_ID_PAYMENT_PROVIDER_USECASE_PROXY = 'loadPaymentProviderByIdUsecaseProxy';


  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        ...new GenerateQrUsecaseProxy().providers(),
        ...new PaymentProviderUsecaseProxy().providers(),
      ],
      exports: [
        // export generate-qr
        UsecasesProxyModule.POST_CREATE_GENERATE_RQ_USECASE_PROXY,
        UsecasesProxyModule.POST_UPDATE_GENERATE_RQ_USECASE_PROXY,
        UsecasesProxyModule.POST_DELETE_GENERATE_RQ_USECASE_PROXY,
        UsecasesProxyModule.POST_LOAD_ALL_GENERATE_RQ_USECASE_PROXY,
        UsecasesProxyModule.POST_LOAD_BY_ID_GENERATE_RQ_USECASE_PROXY,
        UsecasesProxyModule.POST_GENERATE_QR_USECASE_PROXY,
        // export payment-provider
        UsecasesProxyModule.POST_CREATE_PAYMENT_PROVIDER_USECASE_PROXY,
        UsecasesProxyModule.POST_UPDATE_PAYMENT_PROVIDER_USECASE_PROXY,
        UsecasesProxyModule.POST_DELETE_PAYMENT_PROVIDER_USECASE_PROXY,
        UsecasesProxyModule.POST_LOAD_ALL_PAYMENT_PROVIDER_USECASE_PROXY,
        UsecasesProxyModule.POST_LOAD_BY_ID_PAYMENT_PROVIDER_USECASE_PROXY,],
    };
  }
}