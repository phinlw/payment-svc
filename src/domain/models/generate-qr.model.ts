import { DefaultModel } from "./base.model";

export enum GenerateQrStatus {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
}

export class GenerateQrModel extends DefaultModel {
  userId: string;
  qrType?: string;
  platformType?: string;
  merchantId?: string;
  terminalId?: string;
  promotionCode?: string;
  expiryTime?: string;
  makeTxnTime?: string;
  amount: number;
  currency?: string;
  ref1?: string;
  ref2?: string;
  ref3?: string;
  mobileNum?: string;
  deeplinkMetaData?: DeeplinkMetaData;
  metadata?: string;
  status?: string;
}


export class ResponseGenerateQrModel extends GenerateQrModel {}

export class DeeplinkMetaData {
  deeplink?: string;
  switchBackURL?: string;
  switchBackInfo?: string;
}

export class CreateGenerateQrRequest {
  userId: string;
  qrType?: string;
  platformType?: string;
  merchantId?: string;
  terminalId?: string;
  promotionCode?: string;
  expiryTime?: string;
  makeTxnTime?: string;
  amount: number;
  currency?: string;
  ref1?: string;
  ref2?: string;
  ref3?: string;
  mobileNum?: string;
  deeplinkMetaData?: DeeplinkMetaData;
  metadata?: string;
}

export class CreateGenerateQrResponse {
  _id?: string;
  uniqueId?: number;
  userId?: string;
  expiryTime?: string;
  qrCode?: string;
  qrCodeUrl?: string;
  amount?: number;
  currency?: string;
  ref1?: string;
  ref2?: string;
  ref3?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DeleteGenerateQrRequest {
  _id: string;
}

export class DeleteGenerateQrResponse {
  _id: string;
}

export class UpdateGenerateQrRequest {
  _id: string;
  name: string;
}

export class UpdateGenerateQrResponse extends ResponseGenerateQrModel {}

export class LoadAllGenerateQrRequest {
  name: string;
}

export class LoadAllGenerateQrResponse {
  items: ResponseGenerateQrModel[];
  total: number;
}

export class LoadGenerateQrByIdRequest {
  _id: string;
}

export class LoadGenerateQrByIdResponse extends ResponseGenerateQrModel {}

export class GenerateQrRequest {
  [key: string]: any;
}

export class GenerateQrResponse {
  success: boolean;
  apiResponse: any;
}