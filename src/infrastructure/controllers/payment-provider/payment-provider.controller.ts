import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Controller, Inject, UseGuards } from '@nestjs/common';
import type { QueryProps } from "@domain/models/query.model";

import { 
  CreatePaymentProviderUsecase, 
  UpdatePaymentProviderUsecase, 
  DeletePaymentProviderUsecase, 
  LoadAllPaymentProviderUsecase, 
  LoadPaymentProviderByIdUsecase 
} from '@usecases/payment-provider.usecase';
import {
  CreatePaymentProviderRequest,
  CreatePaymentProviderResponse,
  UpdatePaymentProviderRequest,
  UpdatePaymentProviderResponse,
  DeletePaymentProviderRequest,
  DeletePaymentProviderResponse,
  LoadAllPaymentProviderResponse,
  LoadPaymentProviderByIdRequest,
  LoadPaymentProviderByIdResponse,
} from '@domain/models/payment-provider.model';
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import {PaymentProviderInterface} from '@domain/repositories/payment-provider.interface';
import { APIGrpcGuard } from "@/shared/utils/api-access.util";


@UseGuards(APIGrpcGuard)
@Controller('paymentProvider')
export class PaymentProviderController implements PaymentProviderInterface {
  constructor(
  @Inject(UsecasesProxyModule.POST_CREATE_PAYMENT_PROVIDER_USECASE_PROXY)
  private readonly createPaymentProviderUsecaseProxy: UseCaseProxy<CreatePaymentProviderUsecase>,

  @Inject(UsecasesProxyModule.POST_UPDATE_PAYMENT_PROVIDER_USECASE_PROXY)
  private readonly updatePaymentProviderUsecaseProxy: UseCaseProxy<UpdatePaymentProviderUsecase>,

  @Inject(UsecasesProxyModule.POST_DELETE_PAYMENT_PROVIDER_USECASE_PROXY)
  private readonly deletePaymentProviderUsecaseProxy: UseCaseProxy<DeletePaymentProviderUsecase>,

  @Inject(UsecasesProxyModule.POST_LOAD_ALL_PAYMENT_PROVIDER_USECASE_PROXY)
  private readonly loadAllPaymentProviderUsecaseProxy: UseCaseProxy<LoadAllPaymentProviderUsecase>,

  @Inject(UsecasesProxyModule.POST_LOAD_BY_ID_PAYMENT_PROVIDER_USECASE_PROXY)
  private readonly loadPaymentProviderByIdUsecaseProxy: UseCaseProxy<LoadPaymentProviderByIdUsecase>,
  ) {}

  @GrpcMethod("PaymentProviderService", "PaymentProviderCreate")
  async create(
    paymentProvider: CreatePaymentProviderRequest,
    metadata: Metadata
    ): Promise<CreatePaymentProviderResponse| null> {
    const run = await this.createPaymentProviderUsecaseProxy
    .getInstance()
    .execute(paymentProvider,metadata);
    return run;
  }

  @GrpcMethod("PaymentProviderService", "PaymentProviderUpdate")
  async update(
    paymentProvider: UpdatePaymentProviderRequest,
    metadata: Metadata
    ): Promise<UpdatePaymentProviderResponse | null> {
    const run = await this.updatePaymentProviderUsecaseProxy
    .getInstance()
    .execute(paymentProvider,metadata);
    return run;
  }

  @GrpcMethod("PaymentProviderService", "PaymentProviderDelete")
  async delete(
    params: DeletePaymentProviderRequest,
    metadata: Metadata
    ): Promise<DeletePaymentProviderResponse | null> {
    const run = await this.deletePaymentProviderUsecaseProxy
    .getInstance()
    .execute(params,metadata);
    return run;
  }

  @GrpcMethod("PaymentProviderService", "PaymentProviderLoadAll")
  async loadAll(quuery: QueryProps, metadata: Metadata): Promise<LoadAllPaymentProviderResponse> {
    const run = await this.loadAllPaymentProviderUsecaseProxy
    .getInstance()
    .execute(quuery,metadata);
    return run;
  }

  @GrpcMethod("PaymentProviderService", "PaymentProviderLoadById")
  async loadById(
    params: LoadPaymentProviderByIdRequest,
    metadata: Metadata
    ): Promise<LoadPaymentProviderByIdResponse | null> {
    const run = await this.loadPaymentProviderByIdUsecaseProxy
    .getInstance()
    .execute(params,metadata);
    return run;
  }
  
}