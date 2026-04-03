import { QueryProps } from '@domain/models/query.model';
import { Metadata } from "@grpc/grpc-js";
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


  NotifyPaymentRequest,

  NotifyPaymentResponse,



  RetryPaymentRequest,


  RetryPaymentResponse,
} from '../models/generate-qr.model';

export interface GenerateQrInterface {
  create(
    generateQr: CreateGenerateQrRequest,
    metadata?: Metadata
    ): Promise<CreateGenerateQrResponse | null>;
  update(
    generateQr: UpdateGenerateQrRequest,
    metadata?: Metadata
    ): Promise<UpdateGenerateQrResponse | null>;
  delete(
    generateQr: DeleteGenerateQrRequest,
    metadata?: Metadata
    ): Promise<DeleteGenerateQrResponse | null>;
  loadAll(query: QueryProps, metadata?: Metadata): Promise<LoadAllGenerateQrResponse>;
  loadById(
    generateQr: LoadGenerateQrByIdRequest,
    metadata?: Metadata
    ): Promise<LoadGenerateQrByIdResponse | null>;
  generateQr(
    params: GenerateQrRequest,
    metadata?: Metadata
    ): Promise<GenerateQrResponse | null>;
  notifyPayment(params: NotifyPaymentRequest, metadata?: Metadata): Promise<NotifyPaymentResponse | null>;
  retryPayment(params: RetryPaymentRequest, metadata?: Metadata): Promise<RetryPaymentResponse | null>;
}