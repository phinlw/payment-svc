import { Metadata } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { handleGrpcOperation } from '@shared/utils/base.util';

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
    LoadAllPaymentProviderRequest,
    } from '@domain/models/payment-provider.model';
import { PaymentProviderEntity } from '@infrastructure/entities/payment-provider.entity';
import { PaymentProviderInterface } from '@domain/repositories/payment-provider.interface';



import { CreatePaymentProviderAction } from './createPaymentProvider/createPaymentProvider.action';
import { CreatePaymentProviderValidation } from './createPaymentProvider/createPaymentProvider.validation';

import { UpdatePaymentProviderAction } from './updatePaymentProvider/updatePaymentProvider.action';
import { UpdatePaymentProviderValidation } from './updatePaymentProvider/updatePaymentProvider.validation';

import { DeletePaymentProviderAction } from './deletePaymentProvider/deletePaymentProvider.action';
import { DeletePaymentProviderValidation } from './deletePaymentProvider/deletePaymentProvider.validation';

import { LoadAllPaymentProviderAction } from './loadAllPaymentProvider/loadAllPaymentProvider.action';
import { LoadAllPaymentProviderValidation } from './loadAllPaymentProvider/loadAllPaymentProvider.validation';

import { LoadPaymentProviderByIdAction } from './loadPaymentProviderById/loadPaymentProviderById.action';
import { LoadPaymentProviderByIdValidation } from './loadPaymentProviderById/loadPaymentProviderById.validation';
import { QueryProps } from '@domain/models/query.model';
  

@Injectable()
export class PaymentProviderRepoImpl implements PaymentProviderInterface {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(PaymentProviderEntity)
    private readonly paymentProviderEntity: Repository<PaymentProviderEntity>,
  ) {}

  async create(
    paymentProvider: CreatePaymentProviderRequest, 
    metadata?: any | Metadata,
    ): Promise<CreatePaymentProviderResponse | null> {
    return handleGrpcOperation(async () => {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {
      await new CreatePaymentProviderValidation(this.paymentProviderEntity).execute(paymentProvider);

      const result = await new CreatePaymentProviderAction(session).execute(paymentProvider);

      await session.commitTransaction();
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
  }, 'CreatePaymentProvider')
}

  async update(
  paymentProvider: UpdatePaymentProviderRequest, 
    metadata?: any | Metadata,
  ): Promise<UpdatePaymentProviderResponse | null> {
    return handleGrpcOperation(async () => {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {
      await new UpdatePaymentProviderValidation( this.paymentProviderEntity).execute(paymentProvider);

      const result = await new UpdatePaymentProviderAction(session).execute(paymentProvider);

      await session.commitTransaction();
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
  }, 'UpdatePaymentProvider')
}

  async delete(
   paymentProvider: DeletePaymentProviderRequest, 
    metadata?: any | Metadata,
  ): Promise<DeletePaymentProviderResponse | null> {
    return handleGrpcOperation(async () => {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {

      await new DeletePaymentProviderValidation(this.paymentProviderEntity).execute(paymentProvider);

      const result = await new DeletePaymentProviderAction(session).execute(paymentProvider);

      await session.commitTransaction();    
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
  }, 'DeletePaymentProvider')
}

  async loadAll(query: QueryProps): Promise<LoadAllPaymentProviderResponse> {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {
      // const data = {};
      // await new LoadAllPaymentProviderValidation(this.paymentProviderEntity).execute(data);

      const result: LoadAllPaymentProviderResponse = await new LoadAllPaymentProviderAction(session).execute(query);

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
    paymentProvider: LoadPaymentProviderByIdRequest,
    metadata?: any | Metadata
    ): Promise<LoadPaymentProviderByIdResponse | null> {
    return handleGrpcOperation(async () => {
    const session = this.dataSource.createQueryRunner();
    await session.connect();
    await session.startTransaction();
    try {

      await new LoadPaymentProviderByIdValidation(this.paymentProviderEntity).execute(paymentProvider);

      const result = await new LoadPaymentProviderByIdAction(session).execute(paymentProvider);

      await session.commitTransaction();
      return result
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.release();
    }
    }, 'LoadByIdPaymentProvider')
    }
}