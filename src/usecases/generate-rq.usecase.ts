import { Metadata } from '@grpc/grpc-js';
import { LoggerInterface } from '@domain/logger/logger.interface';
import { GenerateRqInterface } from '@domain/repositories/generate-rq.interface';
import { QueryProps } from '@domain/models/query.model';
import {
  CreateGenerateRqResponse,
  UpdateGenerateRqResponse,
  DeleteGenerateRqResponse,
  LoadGenerateRqByIdResponse,
  LoadAllGenerateRqResponse,
  CreateGenerateRqRequest,
  UpdateGenerateRqRequest,
  DeleteGenerateRqRequest,
  LoadGenerateRqByIdRequest,
  GenerateQrRequest,
  GenerateQrResponse,
} from '@domain/models/generate-rq.model';


abstract class BaseGenerateRqUsecase {
  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly generateRqInterface: GenerateRqInterface,
  ) {}


  protected logExecution(usecaseName: string): void {
    this.logger.log(usecaseName, 'execute');
  }
}


export class CreateGenerateRqUsecase extends BaseGenerateRqUsecase {
  async execute(
    params: CreateGenerateRqRequest,
    metadata?: Metadata | any,
  ): Promise<CreateGenerateRqResponse> {
    this.logExecution('CreateGenerateRqUsecase');
    const result = await this.generateRqInterface.create(params, metadata);
    if (!result) {
      throw new Error('Failed to create generate-rq');
    }
    return result;
  }
}


export class UpdateGenerateRqUsecase extends BaseGenerateRqUsecase {
  async execute(
    params: UpdateGenerateRqRequest,
    metadata?: Metadata | any,
  ): Promise<UpdateGenerateRqResponse> {
    this.logExecution('UpdateGenerateRqUsecase');
    const result = await this.generateRqInterface.update(params, metadata);
    if (!result) {
      throw new Error('Failed to update generate-rq');
    }
    return result;
  }
}


export class DeleteGenerateRqUsecase extends BaseGenerateRqUsecase {
  async execute(
    params: DeleteGenerateRqRequest,
    metadata?: Metadata | any,
  ): Promise<DeleteGenerateRqResponse> {
    this.logExecution('DeleteGenerateRqUsecase');
    const result = await this.generateRqInterface.delete(params, metadata);
    if (!result) {
      throw new Error('Failed to delete generate-rq');
    }
    return result;
  }
}


export class LoadAllGenerateRqUsecase extends BaseGenerateRqUsecase {
  async execute(
    query: QueryProps,
    metadata?: Metadata | any,
  ): Promise<LoadAllGenerateRqResponse> {
    this.logExecution('LoadAllGenerateRqUsecase');
    return this.generateRqInterface.loadAll(query, metadata);
  }
}
export class LoadGenerateRqByIdUsecase extends BaseGenerateRqUsecase {
  async execute(
    params: LoadGenerateRqByIdRequest,
    metadata?: Metadata | any,
  ): Promise<LoadGenerateRqByIdResponse> {
    this.logExecution('LoadGenerateRqByIdUsecase');
    const result = await this.generateRqInterface.loadById(params, metadata);
    if (!result) {
      throw new Error(`GenerateRq not found with id: ${params._id}`);
    }
    return result;
  }
}

export class GenerateQrUsecase extends BaseGenerateRqUsecase {
  async execute(
    params: GenerateQrRequest,
    metadata?: Metadata | any,
  ): Promise<GenerateQrResponse> {
    this.logExecution('GenerateQrUsecase');
    const result = await this.generateRqInterface.generateQr(params, metadata);
    if (!result) {
      throw new Error('Failed to generate QR');
    }
    return result;
  }
}