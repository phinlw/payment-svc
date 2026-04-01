import { DefaultModel } from "./base.model";

export enum GenerateRqStatus {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
}

export class GenerateRqModel extends DefaultModel {
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


export class ResponseGenerateRqModel extends GenerateRqModel {}

export class DeeplinkMetaData {
  deeplink?: string;
  switchBackURL?: string;
  switchBackInfo?: string;
}

export class CreateGenerateRqRequest {
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

export class CreateGenerateRqResponse {
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

export class DeleteGenerateRqRequest {
  _id: string;
}

export class DeleteGenerateRqResponse {
  _id: string;
}

export class UpdateGenerateRqRequest {
  _id: string;
  name: string;
}

export class UpdateGenerateRqResponse extends ResponseGenerateRqModel {}

export class LoadAllGenerateRqRequest {
  name: string;
}

export class LoadAllGenerateRqResponse {
  items: ResponseGenerateRqModel[];
  total: number;
}

export class LoadGenerateRqByIdRequest {
  _id: string;
}

export class LoadGenerateRqByIdResponse extends ResponseGenerateRqModel {}

export class GenerateQrRequest {
  [key: string]: any;
}

export class GenerateQrResponse {
  success: boolean;
  apiResponse: any;
}