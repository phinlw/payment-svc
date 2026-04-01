import { QueryProps } from '@domain/models/query.model';
import { Metadata } from "@grpc/grpc-js";
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
  GenerateQrRequest,
  GenerateQrResponse,
} from '../models/generate-rq.model';

export interface GenerateRqInterface {
  create(
    generateRq: CreateGenerateRqRequest,
    metadata?: Metadata
    ): Promise<CreateGenerateRqResponse | null>;
  update(
    generateRq: UpdateGenerateRqRequest,
    metadata?: Metadata
    ): Promise<UpdateGenerateRqResponse | null>;
  delete(
    generateRq: DeleteGenerateRqRequest,
    metadata?: Metadata
    ): Promise<DeleteGenerateRqResponse | null>;
  loadAll(query: QueryProps, metadata?: Metadata): Promise<LoadAllGenerateRqResponse>;
  loadById(
    generateRq: LoadGenerateRqByIdRequest,
    metadata?: Metadata
    ): Promise<LoadGenerateRqByIdResponse | null>;
  generateQr(
    params: GenerateQrRequest,
    metadata?: Metadata
    ): Promise<GenerateQrResponse | null>;
}