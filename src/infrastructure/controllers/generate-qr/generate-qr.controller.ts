import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Controller, Inject, UseGuards } from '@nestjs/common';
import type { QueryProps } from "@domain/models/query.model";

import { 
  CreateGenerateQrUsecase, 
  UpdateGenerateQrUsecase, 
  DeleteGenerateQrUsecase, 
  LoadAllGenerateQrUsecase, 
  LoadGenerateQrByIdUsecase,
  GenerateQrUsecase,
} from '@usecases/generate-qr.usecase';
import {
  CreateGenerateQrRequest,
  CreateGenerateQrResponse,
  UpdateGenerateQrRequest,
  UpdateGenerateQrResponse,
  DeleteGenerateQrRequest,
  DeleteGenerateQrResponse,
  LoadAllGenerateQrResponse,
  LoadGenerateQrByIdRequest,
  LoadGenerateQrByIdResponse,
  GenerateQrRequest,
  GenerateQrResponse,
} from '@domain/models/generate-qr.model';
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import {GenerateQrInterface} from '@domain/repositories/generate-qr.interface';
import { APIGrpcGuard } from "@/shared/utils/api-access.util";


@UseGuards(APIGrpcGuard)
@Controller('generateQr')
export class GenerateQrController implements GenerateQrInterface {
  constructor(
  @Inject(UsecasesProxyModule.POST_CREATE_GENERATE_RQ_USECASE_PROXY)
  private readonly createGenerateQrUsecaseProxy: UseCaseProxy<CreateGenerateQrUsecase>,

  @Inject(UsecasesProxyModule.POST_UPDATE_GENERATE_RQ_USECASE_PROXY)
  private readonly updateGenerateQrUsecaseProxy: UseCaseProxy<UpdateGenerateQrUsecase>,

  @Inject(UsecasesProxyModule.POST_DELETE_GENERATE_RQ_USECASE_PROXY)
  private readonly deleteGenerateQrUsecaseProxy: UseCaseProxy<DeleteGenerateQrUsecase>,

  @Inject(UsecasesProxyModule.POST_LOAD_ALL_GENERATE_RQ_USECASE_PROXY)
  private readonly loadAllGenerateQrUsecaseProxy: UseCaseProxy<LoadAllGenerateQrUsecase>,

  @Inject(UsecasesProxyModule.POST_LOAD_BY_ID_GENERATE_RQ_USECASE_PROXY)
  private readonly loadGenerateQrByIdUsecaseProxy: UseCaseProxy<LoadGenerateQrByIdUsecase>,

  @Inject(UsecasesProxyModule.POST_GENERATE_QR_USECASE_PROXY)
  private readonly generateQrUsecaseProxy: UseCaseProxy<GenerateQrUsecase>,
  ) {}

  @GrpcMethod("GenerateQrService", "GenerateQrCreate")
  async create(
    generateQr: CreateGenerateQrRequest,
    metadata: Metadata
    ): Promise<CreateGenerateQrResponse| null> {
    const run = await this.createGenerateQrUsecaseProxy
    .getInstance()
    .execute(generateQr,metadata);
    return run;
  }

  @GrpcMethod("GenerateQrService", "GenerateQrUpdate")
  async update(
    generateQr: UpdateGenerateQrRequest,
    metadata: Metadata
    ): Promise<UpdateGenerateQrResponse | null> {
    const run = await this.updateGenerateQrUsecaseProxy
    .getInstance()
    .execute(generateQr,metadata);
    return run;
  }

  @GrpcMethod("GenerateQrService", "GenerateQrDelete")
  async delete(
    params: DeleteGenerateQrRequest,
    metadata: Metadata
    ): Promise<DeleteGenerateQrResponse | null> {
    const run = await this.deleteGenerateQrUsecaseProxy
    .getInstance()
    .execute(params,metadata);
    return run;
  }

  @GrpcMethod("GenerateQrService", "GenerateQrLoadAll")
  async loadAll(quuery: QueryProps, metadata: Metadata): Promise<LoadAllGenerateQrResponse> {
    const run = await this.loadAllGenerateQrUsecaseProxy
    .getInstance()
    .execute(quuery,metadata);
    return run;
  }

  @GrpcMethod("GenerateQrService", "GenerateQrLoadById")
  async loadById(
    params: LoadGenerateQrByIdRequest,
    metadata: Metadata
    ): Promise<LoadGenerateQrByIdResponse | null> {
    const run = await this.loadGenerateQrByIdUsecaseProxy
    .getInstance()
    .execute(params,metadata);
    return run;
  }

  @GrpcMethod("GenerateQrService", "GenerateQr")
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