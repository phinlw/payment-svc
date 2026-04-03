import { QueryRunner } from 'typeorm';
import { RetryPaymentRequest, RetryPaymentResponse } from '@domain/models/generate-qr.model';
import { GenerateQrEntity, GenerateQrStatus } from '@infrastructure/entities/generate-qr.entity';

export class RetryPaymentAction {
  private _id: string;

  constructor(private readonly session: QueryRunner) {}

  public async execute(params: RetryPaymentRequest): Promise<RetryPaymentResponse> {
    try {
      this.buildParams(params);
      return await this.performRetryPayment();
    } catch (error) {
      console.error('ERROR RetryPaymentAction.execute', error?.message);
      return {
        code: 500,
        status: 'ERROR',
        message: error?.message || String(error),
      };
    }
  }

  /**
   * Build parameters
   */
  private buildParams(params: RetryPaymentRequest): void {
    this._id = params._id;
  }

  /**
   * Find record by _id, check status, update to COMPLETE if not already complete
   */
  private async performRetryPayment(): Promise<RetryPaymentResponse> {
    const entity = await this.session.manager.findOne(GenerateQrEntity, {
      where: { _id: this._id },
    });

    if (!entity) {
      return {
        code: 404,
        status: 'NOT_FOUND',
        message: `Record not found for _id: ${this._id}`,
      };
    }

    if (entity.status === GenerateQrStatus.COMPLETE) {
      return {
        code: 400,
        status: 'ALREADY_COMPLETED',
        message: `Record already completed for _id: ${this._id}`,
        data: this.mapEntityToData(entity),
      };
    }

    await this.session.manager.update(
      GenerateQrEntity,
      { _id: this._id },
      { status: GenerateQrStatus.COMPLETE, updatedAt: new Date() },
    );

    const updated = await this.session.manager.findOne(GenerateQrEntity, {
      where: { _id: this._id },
    });

    if (!updated) {
      return {
        code: 500,
        status: 'ERROR',
        message: `Record not found after update for _id: ${this._id}`,
      };
    }

    return {
      code: 200,
      status: 'OK',
      message: 'Successful.',
      data: this.mapEntityToData(updated),
    };
  }

  /**
   * Map entity to response data
   */
  private mapEntityToData(entity: GenerateQrEntity) {
    return {
      _id: entity._id,
      uniqueId: entity.uniqueId,
      paymentProviderId: entity.paymentProviderId,
      userId: entity.userId,
      qrType: entity.qrType,
      platformType: entity.platformType,
      merchantId: entity.merchantId,
      terminalId: entity.terminalId,
      promotionCode: entity.promotionCode,
      expiryTime: entity.expiryTime,
      makeTxnTime: entity.makeTxnTime,
      amount: entity.amount,
      currency: entity.currency,
      ref1: entity.ref1,
      ref2: entity.ref2,
      ref3: entity.ref3,
      mobileNum: entity.mobileNum,
      qrCode: entity.qrCode,
      qrCodeUrl: entity.qrCodeUrl,
      callbackUrl: entity.callbackUrl,
      callbackKey: entity.callbackKey,
      recordStatus: entity.status,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
