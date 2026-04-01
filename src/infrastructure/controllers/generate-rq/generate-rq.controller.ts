import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Controller, Inject, UseGuards } from '@nestjs/common';
import type { QueryProps } from "@domain/models/query.model";

import { 
  CreateGenerateRqUsecase, 
  UpdateGenerateRqUsecase, 
  DeleteGenerateRqUsecase, 
  LoadAllGenerateRqUsecase, 
  LoadGenerateRqByIdUsecase,
  GenerateQrUsecase,
} from '@usecases/generate-rq.usecase';
import {
  CreateGenerateRqRequest,
  CreateGenerateRqResponse,
  UpdateGenerateRqRequest,
  UpdateGenerateRqResponse,
  DeleteGenerateRqRequest,
  DeleteGenerateRqResponse,
  LoadAllGenerateRqResponse,
  LoadGenerateRqByIdRequest,
  LoadGenerateRqByIdResponse,
  GenerateQrRequest,
  GenerateQrResponse,
} from '@domain/models/generate-rq.model';
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import {GenerateRqInterface} from '@domain/repositories/generate-rq.interface';
import { APIGrpcGuard } from "@/shared/utils/api-access.util";


@UseGuards(APIGrpcGuard)
@Controller('generateRq')
export class GenerateRqController implements GenerateRqInterface {
  constructor(
  @Inject(UsecasesProxyModule.POST_CREATE_GENERATE_RQ_USECASE_PROXY)
  private readonly createGenerateRqUsecaseProxy: UseCaseProxy<CreateGenerateRqUsecase>,

  @Inject(UsecasesProxyModule.POST_UPDATE_GENERATE_RQ_USECASE_PROXY)
  private readonly updateGenerateRqUsecaseProxy: UseCaseProxy<UpdateGenerateRqUsecase>,

  @Inject(UsecasesProxyModule.POST_DELETE_GENERATE_RQ_USECASE_PROXY)
  private readonly deleteGenerateRqUsecaseProxy: UseCaseProxy<DeleteGenerateRqUsecase>,

  @Inject(UsecasesProxyModule.POST_LOAD_ALL_GENERATE_RQ_USECASE_PROXY)
  private readonly loadAllGenerateRqUsecaseProxy: UseCaseProxy<LoadAllGenerateRqUsecase>,

  @Inject(UsecasesProxyModule.POST_LOAD_BY_ID_GENERATE_RQ_USECASE_PROXY)
  private readonly loadGenerateRqByIdUsecaseProxy: UseCaseProxy<LoadGenerateRqByIdUsecase>,

  @Inject(UsecasesProxyModule.POST_GENERATE_QR_USECASE_PROXY)
  private readonly generateQrUsecaseProxy: UseCaseProxy<GenerateQrUsecase>,
  ) {}

  @GrpcMethod("GenerateRqService", "GenerateRqCreate")
  async create(
    generateRq: CreateGenerateRqRequest,
    metadata: Metadata
    ): Promise<CreateGenerateRqResponse| null> {
    const run = await this.createGenerateRqUsecaseProxy
    .getInstance()
    .execute(generateRq,metadata);
    return run;
  }

  @GrpcMethod("GenerateRqService", "GenerateRqUpdate")
  async update(
    generateRq: UpdateGenerateRqRequest,
    metadata: Metadata
    ): Promise<UpdateGenerateRqResponse | null> {
    const run = await this.updateGenerateRqUsecaseProxy
    .getInstance()
    .execute(generateRq,metadata);
    return run;
  }

  @GrpcMethod("GenerateRqService", "GenerateRqDelete")
  async delete(
    params: DeleteGenerateRqRequest,
    metadata: Metadata
    ): Promise<DeleteGenerateRqResponse | null> {
    const run = await this.deleteGenerateRqUsecaseProxy
    .getInstance()
    .execute(params,metadata);
    return run;
  }

  @GrpcMethod("GenerateRqService", "GenerateRqLoadAll")
  async loadAll(quuery: QueryProps, metadata: Metadata): Promise<LoadAllGenerateRqResponse> {
    const run = await this.loadAllGenerateRqUsecaseProxy
    .getInstance()
    .execute(quuery,metadata);
    return run;
  }

  @GrpcMethod("GenerateRqService", "GenerateRqLoadById")
  async loadById(
    params: LoadGenerateRqByIdRequest,
    metadata: Metadata
    ): Promise<LoadGenerateRqByIdResponse | null> {
    const run = await this.loadGenerateRqByIdUsecaseProxy
    .getInstance()
    .execute(params,metadata);
    return run;
  }

  @GrpcMethod("GenerateRqService", "GenerateQr")
  async generateQr(
    params: GenerateQrRequest,
    metadata: Metadata
    ): Promise<GenerateQrResponse | null> {
    const run = await this.generateQrUsecaseProxy
    .getInstance()
    .execute(params,metadata);
    return run;
  }
  
}