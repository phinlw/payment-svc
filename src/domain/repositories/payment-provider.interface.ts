import { QueryProps } from '@domain/models/query.model';
import { Metadata } from "@grpc/grpc-js";
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
} from '../models/payment-provider.model';

export interface PaymentProviderInterface {
  create(
    paymentProvider: CreatePaymentProviderRequest,
    metadata?: Metadata
    ): Promise<CreatePaymentProviderResponse | null>;
  update(
    paymentProvider: UpdatePaymentProviderRequest,
    metadata?: Metadata
    ): Promise<UpdatePaymentProviderResponse | null>;
  delete(
    paymentProvider: DeletePaymentProviderRequest,
    metadata?: Metadata
    ): Promise<DeletePaymentProviderResponse | null>;
  loadAll(query: QueryProps, metadata?: Metadata): Promise<LoadAllPaymentProviderResponse>;
  loadById(
    paymentProvider: LoadPaymentProviderByIdRequest,
    metadata?: Metadata
    ): Promise<LoadPaymentProviderByIdResponse | null>;
}