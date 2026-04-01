import { Metadata } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { handleGrpcOperation } from '@shared/utils/base.util';

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
    LoadAllGenerateQrRequest,
    GenerateQrRequest,
    GenerateQrResponse,
    } from '@domain/models/generate-qr.model';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';
import { GenerateQrInterface } from '@domain/repositories/generate-qr.interface';



import { CreateGenerateQrAction } from './createGenerateQr/createGenerateQr.action';
import { CreateGenerateQrValidation } from './createGenerateQr/createGenerateQr.validation';

import { UpdateGenerateQrAction } from './updateGenerateQr/updateGenerateQr.action';
import { UpdateGenerateQrValidation } from './updateGenerateQr/updateGenerateQr.validation';

import { DeleteGenerateQrAction } from './deleteGenerateQr/deleteGenerateQr.action';
import { DeleteGenerateQrValidation } from './deleteGenerateQr/deleteGenerateQr.validation';

import { LoadAllGenerateQrAction } from './loadAllGenerateQr/loadAllGenerateQr.action';
import { LoadAllGenerateQrValidation } from './loadAllGenerateQr/loadAllGenerateQr.validation';

import { LoadGenerateQrByIdAction } from './loadGenerateQrById/loadGenerateQrById.action';
import { LoadGenerateQrByIdValidation } from './loadGenerateQrById/loadGenerateQrById.validation';

import { GenerateQrAction } from './generateQr/generateQr.action';
import { GenerateQrValidation } from './generateQr/generateQr.validation';
import { QueryProps } from '@domain/models/query.model';
  

@Injectable()
export class GenerateQrRepoImpl implements GenerateQrInterface {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(GenerateQrEntity)
    private readonly generateQrEntity: Repository<GenerateQrEntity>,
  ) {}

  async create(
    generateQr: CreateGenerateQrRequest, 
    metadata?: any | Metadata,
    ): Promise<CreateGenerateQrResponse | null> {
    return handleGrpcOperation(async () => {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {
      await new CreateGenerateQrValidation(this.generateQrEntity).execute(generateQr);

      const result = await new CreateGenerateQrAction(session).execute(generateQr);

      await session.commitTransaction();
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
  }, 'CreateGenerateQr')
}

  async update(
  generateQr: UpdateGenerateQrRequest, 
    metadata?: any | Metadata,
  ): Promise<UpdateGenerateQrResponse | null> {
    return handleGrpcOperation(async () => {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {
      await new UpdateGenerateQrValidation( this.generateQrEntity).execute(generateQr);

      const result = await new UpdateGenerateQrAction(session).execute(generateQr);

      await session.commitTransaction();
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
  }, 'UpdateGenerateQr')
}

  async delete(
   generateQr: DeleteGenerateQrRequest, 
    metadata?: any | Metadata,
  ): Promise<DeleteGenerateQrResponse | null> {
    return handleGrpcOperation(async () => {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {

      await new DeleteGenerateQrValidation(this.generateQrEntity).execute(generateQr);

      const result = await new DeleteGenerateQrAction(session).execute(generateQr);

      await session.commitTransaction();    
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
  }, 'DeleteGenerateQr')
}

  async loadAll(query: QueryProps): Promise<LoadAllGenerateQrResponse> {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {
      // const data = {};
      // await new LoadAllGenerateQrValidation(this.generateQrEntity).execute(data);

      const result: LoadAllGenerateQrResponse = await new LoadAllGenerateQrAction(session).execute(query);

      await session.commitTransaction();
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
}

  async loadById(
    generateQr: LoadGenerateQrByIdRequest,
    metadata?: any | Metadata
    ): Promise<LoadGenerateQrByIdResponse | null> {
    return handleGrpcOperation(async () => {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {

      await new LoadGenerateQrByIdValidation(this.generateQrEntity).execute(generateQr);

      const result = await new LoadGenerateQrByIdAction(session).execute(generateQr);

      await session.commitTransaction();
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
    }, 'LoadByIdGenerateQr')
    }

  async generateQr(
    params: GenerateQrRequest,
    metadata?: any | Metadata,
  ): Promise<GenerateQrResponse | null> {
    return handleGrpcOperation(async () => {
      try {
        await new GenerateQrValidation(this.generateQrEntity).execute(params);

        const result = await new GenerateQrAction().execute(params);

        return result;
      } catch (error) {
        throw error;
      }
    }, 'GenerateQr')
  }
}