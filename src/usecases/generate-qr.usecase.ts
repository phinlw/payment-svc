import { Metadata } from '@grpc/grpc-js';
import { LoggerInterface } from '@domain/logger/logger.interface';
import { GenerateQrInterface } from '@domain/repositories/generate-qr.interface';
import { QueryProps } from '@domain/models/query.model';
import {
  CreateGenerateQrResponse,
  UpdateGenerateQrResponse,
  DeleteGenerateQrResponse,
  LoadGenerateQrByIdResponse,
  LoadAllGenerateQrResponse,
  CreateGenerateQrRequest,
  UpdateGenerateQrRequest,
  DeleteGenerateQrRequest,
  LoadGenerateQrByIdRequest,
  GenerateQrRequest,
  GenerateQrResponse,


  NotifyPaymentRequest,

  NotifyPaymentResponse,



  RetryPaymentRequest,


  RetryPaymentResponse,
} from '@domain/models/generate-qr.model';


abstract class BaseGenerateQrUsecase {
  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly generateQrInterface: GenerateQrInterface,
  ) {}


  protected logExecution(usecaseName: string): void {
    this.logger.log(usecaseName, 'execute');
  }
}


export class CreateGenerateQrUsecase extends BaseGenerateQrUsecase {
  async execute(
    params: CreateGenerateQrRequest,
    metadata?: Metadata | any,
  ): Promise<CreateGenerateQrResponse> {
    this.logExecution('CreateGenerateQrUsecase');
    const result = await this.generateQrInterface.create(params, metadata);
    if (!result) {
      throw new Error('Failed to create generate-qr');
    }
    return result;
  }
}


export class UpdateGenerateQrUsecase extends BaseGenerateQrUsecase {
  async execute(
    params: UpdateGenerateQrRequest,
    metadata?: Metadata | any,
  ): Promise<UpdateGenerateQrResponse> {
    this.logExecution('UpdateGenerateQrUsecase');
    const result = await this.generateQrInterface.update(params, metadata);
    if (!result) {
      throw new Error('Failed to update generate-qr');
    }
    return result;
  }
}


export class DeleteGenerateQrUsecase extends BaseGenerateQrUsecase {
  async execute(
    params: DeleteGenerateQrRequest,
    metadata?: Metadata | any,
  ): Promise<DeleteGenerateQrResponse> {
    this.logExecution('DeleteGenerateQrUsecase');
    const result = await this.generateQrInterface.delete(params, metadata);
    if (!result) {
      throw new Error('Failed to delete generate-qr');
    }
    return result;
  }
}


export class LoadAllGenerateQrUsecase extends BaseGenerateQrUsecase {
  async execute(
    query: QueryProps,
    metadata?: Metadata | any,
  ): Promise<LoadAllGenerateQrResponse> {
    this.logExecution('LoadAllGenerateQrUsecase');
    return this.generateQrInterface.loadAll(query, metadata);
  }
}
export class LoadGenerateQrByIdUsecase extends BaseGenerateQrUsecase {
  async execute(
    params: LoadGenerateQrByIdRequest,
    metadata?: Metadata | any,
  ): Promise<LoadGenerateQrByIdResponse> {
    this.logExecution('LoadGenerateQrByIdUsecase');
    const result = await this.generateQrInterface.loadById(params, metadata);
    if (!result) {
      throw new Error(`GenerateQr not found with id: ${params._id}`);
    }
    return result;
  }
}

export class GenerateQrUsecase extends BaseGenerateQrUsecase {
  async execute(
    params: GenerateQrRequest,
    metadata?: Metadata | any,
  ): Promise<GenerateQrResponse> {
    this.logExecution('GenerateQrUsecase');
    const result = await this.generateQrInterface.generateQr(params, metadata);
    if (!result) {
      throw new Error('Failed to generate QR');
    }
    return result;
  }
}

export class NotifyPaymentUsecase extends BaseGenerateQrUsecase {
  async execute(
    params: NotifyPaymentRequest,
    metadata?: Metadata | any,
  ): Promise<NotifyPaymentResponse> {
    this.logExecution('NotifyPaymentUsecase');
    const result = await this.generateQrInterface.notifyPayment(params, metadata);
    if (!result) {
      throw new Error('Failed to execute notifyPayment');
    }
    return result;
  }
}


export class RetryPaymentUsecase extends BaseGenerateQrUsecase {
  async execute(
    params: RetryPaymentRequest,
    metadata?: Metadata | any,
  ): Promise<RetryPaymentResponse> {
    this.logExecution('RetryPaymentUsecase');
    const result = await this.generateQrInterface.retryPayment(params, metadata);
    if (!result) {
      throw new Error('Failed to execute retryPayment');
    }
    return result;
  }
}
