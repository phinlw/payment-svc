import { LoggerService } from '@infrastructure/logger/logger.service';
import { UseCaseProxy } from './usecases-proxy';
import { UsecasesProxyModule } from './usecases-proxy.module';
import { GenerateRqRepoImpl } from './../repositories/generate-rq/generate-rq.repository';

import { 
  CreateGenerateRqUsecase, 
  UpdateGenerateRqUsecase, 
  DeleteGenerateRqUsecase, 
  LoadAllGenerateRqUsecase, 
  LoadGenerateRqByIdUsecase,
  GenerateQrUsecase,
} from '@usecases/generate-rq.usecase';

export class GenerateRqUsecaseProxy {
    constructor(){}

    providers() {
    return [
      {
      inject:[LoggerService, GenerateRqRepoImpl],
      provide: UsecasesProxyModule.POST_CREATE_GENERATE_RQ_USECASE_PROXY,
      useFactory: (logger: LoggerService, generateRq: GenerateRqRepoImpl) => {
          return new UseCaseProxy(new CreateGenerateRqUsecase(logger, generateRq));
      }
    },
      {
        inject: [LoggerService, GenerateRqRepoImpl],
        provide: UsecasesProxyModule.POST_UPDATE_GENERATE_RQ_USECASE_PROXY,
        useFactory: (logger: LoggerService, generateRq: GenerateRqRepoImpl) => {
          return new UseCaseProxy(new UpdateGenerateRqUsecase(logger, generateRq));
        }
      },
      {
        inject: [LoggerService, GenerateRqRepoImpl],
        provide: UsecasesProxyModule.POST_DELETE_GENERATE_RQ_USECASE_PROXY,
        useFactory: (logger: LoggerService, generateRq: GenerateRqRepoImpl) => {
          return new UseCaseProxy(new DeleteGenerateRqUsecase(logger, generateRq));
        }
      },
      {
        inject: [LoggerService, GenerateRqRepoImpl],
        provide: UsecasesProxyModule.POST_LOAD_ALL_GENERATE_RQ_USECASE_PROXY,
        useFactory: (logger: LoggerService, generateRq: GenerateRqRepoImpl) => {
          return new UseCaseProxy(new LoadAllGenerateRqUsecase(logger, generateRq));
        }
      },
      {
        inject: [LoggerService, GenerateRqRepoImpl],
        provide: UsecasesProxyModule.POST_LOAD_BY_ID_GENERATE_RQ_USECASE_PROXY,
        useFactory: (logger: LoggerService, generateRq: GenerateRqRepoImpl) => {
          return new UseCaseProxy(new LoadGenerateRqByIdUsecase(logger, generateRq));
        }
      },
      {
        inject: [LoggerService, GenerateRqRepoImpl],
        provide: UsecasesProxyModule.POST_GENERATE_QR_USECASE_PROXY,
        useFactory: (logger: LoggerService, generateRq: GenerateRqRepoImpl) => {
          return new UseCaseProxy(new GenerateQrUsecase(logger, generateRq));
        }
      }
    ]
  }
}