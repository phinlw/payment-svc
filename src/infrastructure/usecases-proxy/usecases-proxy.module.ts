/* eslint-disable prettier/prettier */
import { DynamicModule, Module } from '@nestjs/common';
import { GenerateRqUsecaseProxy } from './generate-rq.usecase.proxy';
import { LoggerModule } from '../logger/logger.module';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { RepositoriesModule } from '../repositories/repositories.module';

@Module({
  imports: [LoggerModule, EnvironmentConfigModule, RepositoriesModule],
})
export class UsecasesProxyModule {
  // generate-rq
  static POST_CREATE_GENERATE_RQ_USECASE_PROXY = 'createGenerateRqUsecaseProxy';
  static POST_UPDATE_GENERATE_RQ_USECASE_PROXY = 'updateGenerateRqUsecaseProxy';
  static POST_DELETE_GENERATE_RQ_USECASE_PROXY = 'deleteGenerateRqUsecaseProxy';
  static POST_LOAD_ALL_GENERATE_RQ_USECASE_PROXY = 'loadAllGenerateRqUsecaseProxy';
  static POST_LOAD_BY_ID_GENERATE_RQ_USECASE_PROXY = 'loadGenerateRqByIdUsecaseProxy';
  static POST_GENERATE_QR_USECASE_PROXY = 'generateQrUsecaseProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        ...new GenerateRqUsecaseProxy().providers(),
      ],
      exports: [
        // export generate-rq
        UsecasesProxyModule.POST_CREATE_GENERATE_RQ_USECASE_PROXY,
        UsecasesProxyModule.POST_UPDATE_GENERATE_RQ_USECASE_PROXY,
        UsecasesProxyModule.POST_DELETE_GENERATE_RQ_USECASE_PROXY,
        UsecasesProxyModule.POST_LOAD_ALL_GENERATE_RQ_USECASE_PROXY,
        UsecasesProxyModule.POST_LOAD_BY_ID_GENERATE_RQ_USECASE_PROXY,
        UsecasesProxyModule.POST_GENERATE_QR_USECASE_PROXY,],
    };
  }
}