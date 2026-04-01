import { LoggerService } from '@infrastructure/logger/logger.service';
import { UseCaseProxy } from './usecases-proxy';
import { UsecasesProxyModule } from './usecases-proxy.module';
import { PaymentProviderRepoImpl } from './../repositories/payment-provider/payment-provider.repository';

import { 
  CreatePaymentProviderUsecase, 
  UpdatePaymentProviderUsecase, 
  DeletePaymentProviderUsecase, 
  LoadAllPaymentProviderUsecase, 
  LoadPaymentProviderByIdUsecase 
} from '@usecases/payment-provider.usecase';

export class PaymentProviderUsecaseProxy {
    constructor(){}

    providers() {
    return [
      {
      inject:[LoggerService, PaymentProviderRepoImpl],
      provide: UsecasesProxyModule.POST_CREATE_PAYMENT_PROVIDER_USECASE_PROXY,
      useFactory: (logger: LoggerService, paymentProvider: PaymentProviderRepoImpl) => {
          return new UseCaseProxy(new CreatePaymentProviderUsecase(logger, paymentProvider));
      }
    },
      {
        inject: [LoggerService, PaymentProviderRepoImpl],
        provide: UsecasesProxyModule.POST_UPDATE_PAYMENT_PROVIDER_USECASE_PROXY,
        useFactory: (logger: LoggerService, paymentProvider: PaymentProviderRepoImpl) => {
          return new UseCaseProxy(new UpdatePaymentProviderUsecase(logger, paymentProvider));
        }
      },
      {
        inject: [LoggerService, PaymentProviderRepoImpl],
        provide: UsecasesProxyModule.POST_DELETE_PAYMENT_PROVIDER_USECASE_PROXY,
        useFactory: (logger: LoggerService, paymentProvider: PaymentProviderRepoImpl) => {
          return new UseCaseProxy(new DeletePaymentProviderUsecase(logger, paymentProvider));
        }
      },
      {
        inject: [LoggerService, PaymentProviderRepoImpl],
        provide: UsecasesProxyModule.POST_LOAD_ALL_PAYMENT_PROVIDER_USECASE_PROXY,
        useFactory: (logger: LoggerService, paymentProvider: PaymentProviderRepoImpl) => {
          return new UseCaseProxy(new LoadAllPaymentProviderUsecase(logger, paymentProvider));
        }
      },
      {
        inject: [LoggerService, PaymentProviderRepoImpl],
        provide: UsecasesProxyModule.POST_LOAD_BY_ID_PAYMENT_PROVIDER_USECASE_PROXY,
        useFactory: (logger: LoggerService, paymentProvider: PaymentProviderRepoImpl) => {
          return new UseCaseProxy(new LoadPaymentProviderByIdUsecase(logger, paymentProvider));
        }
      }
    ]
  }
}