import { _ID } from '@shared/utils/base.util';
import { GenerateRqModel, CreateGenerateRqResponse, CreateGenerateRqRequest } from '@domain/models/generate-rq.model';
import { GenerateRqEntity } from '@infrastructure/entities/generate-rq.entity';
import { QueryRunner } from 'typeorm';
import axios from 'axios';
import { generateLdbHeaders, getLdbApiUrl, fetchAccessToken } from '@shared/utils/ldb-header.util';

export class CreateGenerateRqAction  extends GenerateRqModel {
  private qrApiResponse: any = null;

  constructor(private readonly session: QueryRunner) {
    super();
  }

  public async execute(params: CreateGenerateRqRequest): Promise<CreateGenerateRqResponse> {
    try {
      await this.validateAndBuildParams(params);
      const qrBody = this.buildQrRequestBody(params);
      this.currency = qrBody.currency;
      this.ref1 = qrBody.ref1;
      this.ref2 = qrBody.ref2;
      this.ref3 = qrBody.ref3;
      this.expiryTime = qrBody.expiryTime;
      const model = await this.prepareGenerateRqModel(qrBody);
      await this.persistGenerateRq(model);

      this.qrApiResponse = await this.callLdbGenerateQr(qrBody);

      return this.buildResponse();
    } catch (error) {
      console.error('ERROR CreateGenerateRqAction.execute', error?.message);
      throw error instanceof Error ? error : new Error(error?.message || String(error));
    }
  }

  /**
   * Validate and build parameters
   */
  private async validateAndBuildParams(params: CreateGenerateRqRequest): Promise<void> {
    try {
      this.userId = params.userId;
      this.amount = params.amount;
      this.isActive = true;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    } catch (error) {
      console.error('ERROR validateAndBuildParams', error?.message);
      throw new Error(`Failed to validate parameters: ${error?.message || String(error)}`);
    }
  }

  /**
   * Prepare model for insertion
   */
  private async prepareGenerateRqModel(qrBody: Record<string, any>): Promise<GenerateRqModel> {
    try {
      const model: GenerateRqModel = {
        _id: _ID(),
        uniqueId: 0,
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
        status: 'PENDING',
        isActive: this.isActive || true,
        createdAt: this.createdAt || new Date(),
        updatedAt: this.updatedAt || new Date(),
      };

      return model;
    } catch (error) {
      console.error('ERROR prepareGenerateRqModel', error?.message);
      throw new Error(`Failed to prepare model: ${error?.message || String(error)}`);
    }
  }

  /**
   * Persist entity to database
   */
  private async persistGenerateRq(model: GenerateRqModel): Promise<void> {
    try {
      const savedEntity = await this.session.manager.save(GenerateRqEntity, model);

      if (savedEntity) {
        this._id = savedEntity._id;
        this.uniqueId = savedEntity.uniqueId;
      } else {
        throw new Error('Failed to save entity into database');
      }
    } catch (error) {
      console.error('ERROR persistGenerateRq', error?.message);
      throw new Error(`Failed to persist entity: ${error?.message || String(error)}`);
    }
  }

  /**
   * Build QR request body from params
   */
  private buildQrRequestBody(params: CreateGenerateRqRequest): Record<string, any> {
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
        'x-client-Transaction-datetime': headers['x-client-Transaction-datetime'],
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
  private buildResponse(): CreateGenerateRqResponse {
    try {
      const dataResponse = this.qrApiResponse?.dataResponse;
      const qrCode = dataResponse?.qrCode || '';
      const qrCodeUrl = qrCode
        ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode)}`
        : '';

      return {
        _id: this._id,
        uniqueId: this.uniqueId,
        userId: this.userId,
        expiryTime: dataResponse?.expiredTime || '',
        qrCode,
        qrCodeUrl,
        amount: this.amount,
        currency: this.currency,
        ref1: this.ref1,
        ref2: this.ref2,
        ref3: this.ref3,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    } catch (error) {
      console.error('ERROR buildResponse', error?.message);
      throw new Error(`Failed to build response: ${error?.message || String(error)}`);
    }
  }
}