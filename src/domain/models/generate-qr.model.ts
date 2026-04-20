import { DefaultModel } from "./base.model";

export enum GenerateQrStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
  CANCEL = "CANCEL",
  REFUNDED = "REFUNDED",
}

export class GenerateQrModel extends DefaultModel {
  paymentProviderId: string;
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
  deeplinkInfo?: any;
  metadata?: string;
  transactionId?: string;
  qrCode?: string;
  qrCodeUrl?: string;
  callbackUrl?: string;
  callbackKey?: string;
  status?: string;
}

export class ResponseGenerateQrModel extends GenerateQrModel {}

export class DeeplinkMetaData {
  deeplink?: string;
  switchBackURL?: string;
  switchBackInfo?: string;
}

export class CreateGenerateQrRequest {
  paymentProviderId: string;
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
  ref1: string;
  ref2: string;
  ref3: string;
  mobileNum?: string;
  deeplinkMetaData?: DeeplinkMetaData;
  metadata?: string;
  callbackUrl: string;
  callbackKey: string;
}

export class CreateGenerateQrResponse {
  _id?: string;
  uniqueId?: number;
  paymentProviderId?: string;
  userId?: string;
  expiryTime?: string;
  qrCode?: string;
  qrCodeUrl?: string;
  amount?: number;
  currency?: string;
  ref1?: string;
  ref2?: string;
  ref3?: string;
  providerName?: string;
  transactionId?: string;
  deeplinkInfo?: any;
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

export class NotifyPaymentRequest {
  notifyId: number;
  processingStatus: string;
  partnerOrderID: string;
  partnerPaymentID: string;
  paymentBank: string;
  paymentAt: string;
  paymentReference: string;
  amount: number;
  currency: string;
}

export class NotifyPaymentResponse {
  code: number;
  status: string;
  message: string;
}

export class RetryPaymentRequest {
  _id: string;
}

export class RetryPaymentData {
  _id?: string;
  uniqueId?: number;
  paymentProviderId?: string;
  userId?: string;
  qrType?: string;
  platformType?: string;
  merchantId?: string;
  terminalId?: string;
  promotionCode?: string;
  expiryTime?: string;
  makeTxnTime?: string;
  amount?: number;
  currency?: string;
  ref1?: string;
  ref2?: string;
  ref3?: string;
  mobileNum?: string;
  qrCode?: string;
  qrCodeUrl?: string;
  callbackUrl?: string;
  callbackKey?: string;
  recordStatus?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  inquiry?: RetryPaymentInquiryData;
}

export class RetryPaymentInquiryData {
  processingStatus?: string;
  paymentBank?: string;
  paymentAt?: string;
  paymentReference?: string;
  inquiryAmount?: number;
  inquiryCurrency?: string;
  payerName?: string;
  contact?: string;
  txNo?: string;
}

export class RetryPaymentResponse {
  code: number;
  status: string;
  message: string;
  data?: RetryPaymentData;
}
