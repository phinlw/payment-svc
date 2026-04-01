import { DefaultModel } from "./base.model";

export class PaymentProviderModel extends DefaultModel {
  name: string;
  img?: string;
  amount?: number[];
}


export class ResponsePaymentProviderModel extends PaymentProviderModel {}

export class CreatePaymentProviderRequest {
  name: string;
  img?: string;
  amount?: number[];
}

export class CreatePaymentProviderResponse extends ResponsePaymentProviderModel {}

export class DeletePaymentProviderRequest {
  _id: string;
}

export class DeletePaymentProviderResponse {
  _id: string;
}

export class UpdatePaymentProviderRequest {
  _id: string;
  name?: string;
  img?: string;
  amount?: number[];
}

export class UpdatePaymentProviderResponse extends ResponsePaymentProviderModel {}

export class LoadAllPaymentProviderRequest {
  name: string;
}

export class LoadAllPaymentProviderResponse {
  items: ResponsePaymentProviderModel[];
  total: number;
}

export class LoadPaymentProviderByIdRequest {
  _id: string;
}

export class LoadPaymentProviderByIdResponse extends ResponsePaymentProviderModel {}