import { Metadata } from '@grpc/grpc-js';
import { LoggerInterface } from '@domain/logger/logger.interface';
import { PaymentProviderInterface } from '@domain/repositories/payment-provider.interface';
import { QueryProps } from '@domain/models/query.model';
import {
  CreatePaymentProviderResponse,
  UpdatePaymentProviderResponse,
  DeletePaymentProviderResponse,
  LoadPaymentProviderByIdResponse,
  LoadAllPaymentProviderResponse,
  CreatePaymentProviderRequest,
  UpdatePaymentProviderRequest,
  DeletePaymentProviderRequest,
  LoadPaymentProviderByIdRequest,
} from '@domain/models/payment-provider.model';


abstract class BasePaymentProviderUsecase {
  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly paymentProviderInterface: PaymentProviderInterface,
  ) {}


  protected logExecution(usecaseName: string): void {
    this.logger.log(usecaseName, 'execute');
  }
}


export class CreatePaymentProviderUsecase extends BasePaymentProviderUsecase {
  async execute(
    params: CreatePaymentProviderRequest,
    metadata?: Metadata | any,
  ): Promise<CreatePaymentProviderResponse> {
    this.logExecution('CreatePaymentProviderUsecase');
    const result = await this.paymentProviderInterface.create(params, metadata);
    if (!result) {
      throw new Error('Failed to create payment-provider');
    }
    return result;
  }
}


export class UpdatePaymentProviderUsecase extends BasePaymentProviderUsecase {
  async execute(
    params: UpdatePaymentProviderRequest,
    metadata?: Metadata | any,
  ): Promise<UpdatePaymentProviderResponse> {
    this.logExecution('UpdatePaymentProviderUsecase');
    const result = await this.paymentProviderInterface.update(params, metadata);
    if (!result) {
      throw new Error('Failed to update payment-provider');
    }
    return result;
  }
}


export class DeletePaymentProviderUsecase extends BasePaymentProviderUsecase {
  async execute(
    params: DeletePaymentProviderRequest,
    metadata?: Metadata | any,
  ): Promise<DeletePaymentProviderResponse> {
    this.logExecution('DeletePaymentProviderUsecase');
    const result = await this.paymentProviderInterface.delete(params, metadata);
    if (!result) {
      throw new Error('Failed to delete payment-provider');
    }
    return result;
  }
}


export class LoadAllPaymentProviderUsecase extends BasePaymentProviderUsecase {
  async execute(
    query: QueryProps,
    metadata?: Metadata | any,
  ): Promise<LoadAllPaymentProviderResponse> {
    this.logExecution('LoadAllPaymentProviderUsecase');
    return this.paymentProviderInterface.loadAll(query, metadata);
  }
}
export class LoadPaymentProviderByIdUsecase extends BasePaymentProviderUsecase {
  async execute(
    params: LoadPaymentProviderByIdRequest,
    metadata?: Metadata | any,
  ): Promise<LoadPaymentProviderByIdResponse> {
    this.logExecution('LoadPaymentProviderByIdUsecase');
    const result = await this.paymentProviderInterface.loadById(params, metadata);
    if (!result) {
      throw new Error(`PaymentProvider not found with id: ${params._id}`);
    }
    return result;
  }
}