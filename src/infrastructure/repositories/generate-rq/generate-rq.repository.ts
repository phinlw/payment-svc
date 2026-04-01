import { Metadata } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { handleGrpcOperation } from '@shared/utils/base.util';

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
    LoadAllGenerateRqRequest,
    GenerateQrRequest,
    GenerateQrResponse,
    } from '@domain/models/generate-rq.model';
import { GenerateRqEntity } from '@infrastructure/entities/generate-rq.entity';
import { GenerateRqInterface } from '@domain/repositories/generate-rq.interface';



import { CreateGenerateRqAction } from './createGenerateRq/createGenerateRq.action';
import { CreateGenerateRqValidation } from './createGenerateRq/createGenerateRq.validation';

import { UpdateGenerateRqAction } from './updateGenerateRq/updateGenerateRq.action';
import { UpdateGenerateRqValidation } from './updateGenerateRq/updateGenerateRq.validation';

import { DeleteGenerateRqAction } from './deleteGenerateRq/deleteGenerateRq.action';
import { DeleteGenerateRqValidation } from './deleteGenerateRq/deleteGenerateRq.validation';

import { LoadAllGenerateRqAction } from './loadAllGenerateRq/loadAllGenerateRq.action';
import { LoadAllGenerateRqValidation } from './loadAllGenerateRq/loadAllGenerateRq.validation';

import { LoadGenerateRqByIdAction } from './loadGenerateRqById/loadGenerateRqById.action';
import { LoadGenerateRqByIdValidation } from './loadGenerateRqById/loadGenerateRqById.validation';

import { GenerateQrAction } from './generateQr/generateQr.action';
import { GenerateQrValidation } from './generateQr/generateQr.validation';
import { QueryProps } from '@domain/models/query.model';
  

@Injectable()
export class GenerateRqRepoImpl implements GenerateRqInterface {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(GenerateRqEntity)
    private readonly generateRqEntity: Repository<GenerateRqEntity>,
  ) {}

  async create(
    generateRq: CreateGenerateRqRequest, 
    metadata?: any | Metadata,
    ): Promise<CreateGenerateRqResponse | null> {
    return handleGrpcOperation(async () => {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {
      await new CreateGenerateRqValidation(this.generateRqEntity).execute(generateRq);

      const result = await new CreateGenerateRqAction(session).execute(generateRq);

      await session.commitTransaction();
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
  }, 'CreateGenerateRq')
}

  async update(
  generateRq: UpdateGenerateRqRequest, 
    metadata?: any | Metadata,
  ): Promise<UpdateGenerateRqResponse | null> {
    return handleGrpcOperation(async () => {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {
      await new UpdateGenerateRqValidation( this.generateRqEntity).execute(generateRq);

      const result = await new UpdateGenerateRqAction(session).execute(generateRq);

      await session.commitTransaction();
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
  }, 'UpdateGenerateRq')
}

  async delete(
   generateRq: DeleteGenerateRqRequest, 
    metadata?: any | Metadata,
  ): Promise<DeleteGenerateRqResponse | null> {
    return handleGrpcOperation(async () => {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {

      await new DeleteGenerateRqValidation(this.generateRqEntity).execute(generateRq);

      const result = await new DeleteGenerateRqAction(session).execute(generateRq);

      await session.commitTransaction();    
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
  }, 'DeleteGenerateRq')
}

  async loadAll(query: QueryProps): Promise<LoadAllGenerateRqResponse> {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {
      // const data = {};
      // await new LoadAllGenerateRqValidation(this.generateRqEntity).execute(data);

      const result: LoadAllGenerateRqResponse = await new LoadAllGenerateRqAction(session).execute(query);

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
    generateRq: LoadGenerateRqByIdRequest,
    metadata?: any | Metadata
    ): Promise<LoadGenerateRqByIdResponse | null> {
    return handleGrpcOperation(async () => {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {

      await new LoadGenerateRqByIdValidation(this.generateRqEntity).execute(generateRq);

      const result = await new LoadGenerateRqByIdAction(session).execute(generateRq);

      await session.commitTransaction();
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
    }, 'LoadByIdGenerateRq')
    }

  async generateQr(
    params: GenerateQrRequest,
    metadata?: any | Metadata,
  ): Promise<GenerateQrResponse | null> {
    return handleGrpcOperation(async () => {
      try {
        await new GenerateQrValidation(this.generateRqEntity).execute(params);

        const result = await new GenerateQrAction().execute(params);

        return result;
      } catch (error) {
        throw error;
      }
    }, 'GenerateQr')
  }
}