import { _ID } from '@shared/utils/base.util';
import {
  GenerateQrModel,
  CreateGenerateQrResponse,
  CreateGenerateQrRequest,
} from '@domain/models/generate-qr.model';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';
import { PaymentProviderEntity } from '@infrastructure/entities/payment-provider.entity';
import { QueryRunner } from 'typeorm';
import axios from 'axios';
import {
  generateLdbHeaders,
  getLdbApiUrl,
  fetchAccessToken,
} from '@shared/utils/ldb-header.util';

export class CreateGenerateQrAction extends GenerateQrModel {
  private qrApiResponse: any = null;
  private providerName: string = '';

  constructor(private readonly session: QueryRunner) {
    super();
  }

  public async execute(
    params: CreateGenerateQrRequest,
  ): Promise<CreateGenerateQrResponse> {
    try {
      await this.validateAndBuildParams(params);
      const qrBody = this.buildQrRequestBody(params);
      this.currency = qrBody.currency;
      this.ref1 = qrBody.ref1;
      this.ref2 = qrBody.ref2;
      this.ref3 = qrBody.ref3;
      this.expiryTime = qrBody.expiryTime;

      this.qrApiResponse = await this.callLdbGenerateQr(qrBody);

      if (this.qrApiResponse?.status !== '00') {
        const msg = this.qrApiResponse?.message || 'Unknown LDB error';
        throw new Error(msg);
      }

      const model = await this.prepareGenerateQrModel(qrBody);
      await this.persistGenerateQr(model);

      return this.buildResponse();
    } catch (error) {
      console.error('ERROR CreateGenerateQrAction.execute', error?.message);
      throw error instanceof Error
        ? error
        : new Error(error?.message || String(error));
    }
  }

  /**
   * Validate and build parameters
   */
  private async validateAndBuildParams(
    params: CreateGenerateQrRequest,
  ): Promise<void> {
    try {
      this.providerName = await this.validatePaymentProvider(
        params.paymentProviderId,
        params.amount,
      );
      this.paymentProviderId = params.paymentProviderId;
      this.userId = params.userId;
      this.amount = params.amount;
      this.callbackUrl = params.callbackUrl;
      this.callbackKey = params.callbackKey;
      this.isActive = true;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    } catch (error) {
      console.error('ERROR validateAndBuildParams', error?.message);
      throw new Error(
        `Failed to validate parameters: ${error?.message || String(error)}`,
      );
    }
  }

  /**
   * Validate that the paymentProviderId exists in the database
   */
  private async validatePaymentProvider(
    paymentProviderId: string,
    amount: number,
  ): Promise<string> {
    if (!paymentProviderId) {
      throw new Error('paymentProviderId is required');
    }

    const provider = await this.session.manager.findOne(PaymentProviderEntity, {
      where: { _id: paymentProviderId, isActive: true },
    });

    if (!provider) {
      throw new Error(
        `Payment provider with id '${paymentProviderId}' not found or inactive`,
      );
    }

    const allowedAmounts = Array.isArray(provider.amount)
      ? provider.amount
      : [];

    if (!allowedAmounts.includes(amount)) {
      throw new Error(
        `Amount '${amount}' is not allowed for payment provider '${paymentProviderId}'. Allowed amounts: ${allowedAmounts.join(', ') || 'none'}`,
      );
    }

    return provider.name;
  }

  /**
   * Prepare model for insertion
   */
  private async prepareGenerateQrModel(
    qrBody: Record<string, any>,
  ): Promise<GenerateQrModel> {
    try {
      const model: GenerateQrModel = {
        _id: _ID(),
        uniqueId: 0,
        paymentProviderId: this.paymentProviderId,
        userId: this.userId,
        qrType: qrBody.qrType,
        platformType: qrBody.platformType,
        merchantId: qrBody.merchantId,
        terminalId: qrBody.terminalId,
        promotionCode: qrBody.promotionCode,
        expiryTime: qrBody.expiryTime,
        makeTxnTime: qrBody.makeTxnTime,
        amount: qrBody.amount,
        currency: qrBody.currency,
        ref1: qrBody.ref1,
        ref2: qrBody.ref2,
        ref3: qrBody.ref3,
        mobileNum: qrBody.mobileNum,
        deeplinkMetaData: qrBody.deeplinkMetaData,
        metadata: qrBody.metadata,
        callbackUrl: qrBody.callbackUrl,
        callbackKey: qrBody.callbackKey,
        qrCode: this.qrApiResponse?.dataResponse?.qrCode || '',
        qrCodeUrl: this.qrApiResponse?.dataResponse?.qrCode
          ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(this.qrApiResponse.dataResponse.qrCode)}`
          : '',
        status: 'PENDING',
        isActive: this.isActive || true,
        createdAt: this.createdAt || new Date(),
        updatedAt: this.updatedAt || new Date(),
      };

      return model;
    } catch (error) {
      console.error('ERROR prepareGenerateQrModel', error?.message);
      throw new Error(
        `Failed to prepare model: ${error?.message || String(error)}`,
      );
    }
  }

  /**
   * Persist entity to database
   */
  private async persistGenerateQr(model: GenerateQrModel): Promise<void> {
    try {
      const savedEntity = await this.session.manager.save(
        GenerateQrEntity,
        model,
      );

      if (savedEntity) {
        this._id = savedEntity._id;
        this.uniqueId = savedEntity.uniqueId;
      } else {
        throw new Error('Failed to save entity into database');
      }
    } catch (error) {
      console.error('ERROR persistGenerateQr', error?.message);
      throw new Error(
        `Failed to persist entity: ${error?.message || String(error)}`,
      );
    }
  }

  /**
   * Build QR request body from params
   */
  private buildQrRequestBody(
    params: CreateGenerateQrRequest,
  ): Record<string, any> {
    // console.log('buildQrRequestBody', params);
    return {
      qrType: params.qrType || '38',
      platformType: params.platformType || 'IOS',
      merchantId: params.merchantId || 'MCH22300LIOL4340',
      terminalId: params.terminalId || null,
      promotionCode: params.promotionCode || null,
      expiryTime: params.expiryTime || '5',
      makeTxnTime: params.makeTxnTime || '1',
      amount: params.amount || 1,
      currency: params.currency || 'LAK',
      ref1: params.ref1 || `BILL${Date.now().toString().slice(-6)}`,
      ref2: params.ref2 || `POSREF${Date.now().toString().slice(-8)}`,
      ref3: params.ref3 || `POS-${new Date().getFullYear()}`,
      mobileNum: params.mobileNum || '2099490807',
      deeplinkMetaData: params.deeplinkMetaData || {
        deeplink: 'N',
        switchBackURL: null,
        switchBackInfo: null,
      },
      metadata: params.metadata || '',
      callbackUrl: params.callbackUrl || '',
      callbackKey: params.callbackKey || '',
    };
  }

  /**
   * Call LDB Generate QR API
   */
  private async callLdbGenerateQr(body: Record<string, any>): Promise<any> {
    try {
      const accessToken = await fetchAccessToken();
      const headers = generateLdbHeaders(body, accessToken);
      const apiUrl = getLdbApiUrl();

      if (!apiUrl) {
        throw new Error('LDB_URL is not configured');
      }

      const apiHeaders = {
        'x-client-transaction-id': headers['x-client-transaction-id'],
        'x-client-Transaction-datetime':
          headers['x-client-Transaction-datetime'],
        partnerId: headers.partnerId,
        digest: headers.digest,
        signature: headers.signature,
        'Content-Type': headers['Content-Type'],
        Authorization: headers.Authorization,
      };

      const response = await axios.post(apiUrl, JSON.stringify(body), {
        headers: apiHeaders,
      });

      // console.log('LDB QR apiResponse ====>', response.data);
      return response.data;
    } catch (error) {
      console.error('ERROR callLdbGenerateQr', error?.message);
      const errorMessage = error?.response?.data
        ? JSON.stringify(error.response.data)
        : error?.message || String(error);
      throw new Error(`LDB API request failed: ${errorMessage}`);
    }
  }

  /**
   * Build response object
   */
  private buildResponse(): CreateGenerateQrResponse {
    try {
      const status = this.qrApiResponse?.status;
      const dataResponse =
        status === '00' ? this.qrApiResponse?.dataResponse : null;
      const qrCode = dataResponse?.qrCode || '';
      const qrCodeUrl = qrCode
        ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode)}`
        : '';

      return {
        _id: this._id,
        uniqueId: this.uniqueId,
        paymentProviderId: this.paymentProviderId,
        userId: this.userId,
        expiryTime: dataResponse?.expiredTime || '',
        qrCode,
        qrCodeUrl,
        amount: this.amount,
        currency: this.currency,
        ref1: this.ref1,
        ref2: this.ref2,
        ref3: this.ref3,
        providerName: this.providerName,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    } catch (error) {
      console.error('ERROR buildResponse', error?.message);
      throw new Error(
        `Failed to build response: ${error?.message || String(error)}`,
      );
    }
  }
}