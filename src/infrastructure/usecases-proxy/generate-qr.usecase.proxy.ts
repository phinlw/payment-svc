import { LoggerService } from '@infrastructure/logger/logger.service';
import { UseCaseProxy } from './usecases-proxy';
import { UsecasesProxyModule } from './usecases-proxy.module';
import { GenerateQrRepoImpl } from './../repositories/generate-qr/generate-qr.repository';

import { 
  CreateGenerateQrUsecase, 
  UpdateGenerateQrUsecase, 
  DeleteGenerateQrUsecase, 
  LoadAllGenerateQrUsecase, 
  LoadGenerateQrByIdUsecase,
  GenerateQrUsecase,
} from '@usecases/generate-qr.usecase';

export class GenerateQrUsecaseProxy {
    constructor(){}

    providers() {
    return [
      {
      inject:[LoggerService, GenerateQrRepoImpl],
      provide: UsecasesProxyModule.POST_CREATE_GENERATE_RQ_USECASE_PROXY,
      useFactory: (logger: LoggerService, generateQr: GenerateQrRepoImpl) => {
          return new UseCaseProxy(new CreateGenerateQrUsecase(logger, generateQr));
      }
    },
      {
        inject: [LoggerService, GenerateQrRepoImpl],
        provide: UsecasesProxyModule.POST_UPDATE_GENERATE_RQ_USECASE_PROXY,
        useFactory: (logger: LoggerService, generateQr: GenerateQrRepoImpl) => {
          return new UseCaseProxy(new UpdateGenerateQrUsecase(logger, generateQr));
        }
      },
      {
        inject: [LoggerService, GenerateQrRepoImpl],
        provide: UsecasesProxyModule.POST_DELETE_GENERATE_RQ_USECASE_PROXY,
        useFactory: (logger: LoggerService, generateQr: GenerateQrRepoImpl) => {
          return new UseCaseProxy(new DeleteGenerateQrUsecase(logger, generateQr));
        }
      },
      {
        inject: [LoggerService, GenerateQrRepoImpl],
        provide: UsecasesProxyModule.POST_LOAD_ALL_GENERATE_RQ_USECASE_PROXY,
        useFactory: (logger: LoggerService, generateQr: GenerateQrRepoImpl) => {
          return new UseCaseProxy(new LoadAllGenerateQrUsecase(logger, generateQr));
        }
      },
      {
        inject: [LoggerService, GenerateQrRepoImpl],
        provide: UsecasesProxyModule.POST_LOAD_BY_ID_GENERATE_RQ_USECASE_PROXY,
        useFactory: (logger: LoggerService, generateQr: GenerateQrRepoImpl) => {
          return new UseCaseProxy(new LoadGenerateQrByIdUsecase(logger, generateQr));
        }
      },
      {
        inject: [LoggerService, GenerateQrRepoImpl],
        provide: UsecasesProxyModule.POST_GENERATE_QR_USECASE_PROXY,
        useFactory: (logger: LoggerService, generateQr: GenerateQrRepoImpl) => {
          return new UseCaseProxy(new GenerateQrUsecase(logger, generateQr));
        }
      }
    ]
  }
}