import { QueryRunner } from 'typeorm';
import {
  RetryPaymentRequest,
  RetryPaymentResponse,
  RetryPaymentInquiryData,
} from '@domain/models/generate-qr.model';
import { GenerateQrEntity, GenerateQrStatus } from '@infrastructure/entities/generate-qr.entity';
import {
  inquiryPayment,
  InquiryTxnItem,
  InquiryPaymentResponse,
} from '@shared/utils/ldb-inquiry.util';

interface CallInquiryResult {
  success: boolean;
  txnItem?: InquiryTxnItem;
  inquiryStatus?: string;
  inquiryMessage?: string;
}

export class RetryPaymentAction {
  private _id: string;

  constructor(private readonly session: QueryRunner) {}

  public async execute(
    params: RetryPaymentRequest,
  ): Promise<RetryPaymentResponse> {
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
   * Find record by _id, call LDB inquiry API to verify payment, then update status
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

    /**
     * Call LDB inquiry API to check if payment was actually completed
     */
    const inquiryResult = await this.callInquiry(entity);

    if (!inquiryResult.success || !inquiryResult.txnItem) {
      return {
        code: 400,
        status: inquiryResult.inquiryStatus || 'INQUIRY_FAILED',
        message:
          inquiryResult.inquiryMessage ||
          `Inquiry API returned no result for _id: ${this._id}`,
        data: this.mapEntityToData(entity),
      };
    }

    const txnItem = inquiryResult.txnItem;

    /**
     * Check processingStatus from inquiry response
     * FNLD = Finalized (payment confirmed)
     */
    if (txnItem.processingStatus !== 'FNLD') {
      return {
        code: 400,
        status: 'PAYMENT_NOT_CONFIRMED',
        message: `Payment not confirmed. processingStatus: ${txnItem.processingStatus}`,
        data: this.mapEntityToData(entity, this.mapInquiryToData(txnItem)),
      };
    }

    /**
     * Payment confirmed — update record to COMPLETE
     */
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
      data: this.mapEntityToData(updated, this.mapInquiryToData(txnItem)),
    };
  }

  /**
   * Call LDB inquiry API using entity transactionId, ref2, and qrType
   */
  private async callInquiry(
    entity: GenerateQrEntity,
  ): Promise<CallInquiryResult> {
    try {
      const transactionId = entity.transactionId;
      const ref2 = entity.ref2;
      const qrType = entity.qrType || 'LAO_QR';

      if (!transactionId || !ref2) {
        console.error('ERROR callInquiry: missing transactionId or ref2', {
          transactionId,
          ref2,
        });
        return {
          success: false,
          inquiryStatus: 'INQUIRY_FAILED',
          inquiryMessage: `Missing transactionId or ref2 for _id: ${this._id}`,
        };
      }

      const inquiryResponse = await inquiryPayment(transactionId, ref2, qrType);

      if (inquiryResponse.status !== '00') {
        // console.error(
        //   'ERROR callInquiry: inquiry status not OK====>',
        //   inquiryResponse,
        // );
        return {
          success: false,
          inquiryStatus: inquiryResponse.status,
          inquiryMessage: inquiryResponse.message,
        };
      }

      const txnItems = inquiryResponse.dataResponse?.txnItem;
      if (!txnItems || txnItems.length === 0) {
        console.error('ERROR callInquiry: no txnItem found');
        return {
          success: false,
          inquiryStatus: 'INQUIRY_EMPTY',
          inquiryMessage: 'Inquiry returned no transaction items',
        };
      }

      return { success: true, txnItem: txnItems[0] };
    } catch (error) {
      console.error('ERROR callInquiry', error?.message);
      return {
        success: false,
        inquiryStatus: 'INQUIRY_ERROR',
        inquiryMessage: error?.message || String(error),
      };
    }
  }

  /**
   * Map inquiry txnItem to RetryPaymentInquiryData
   */
  private mapInquiryToData(txnItem: InquiryTxnItem): RetryPaymentInquiryData {
    return {
      processingStatus: txnItem.processingStatus,
      paymentBank: txnItem.paymentBank,
      paymentAt: txnItem.paymentAt,
      paymentReference: txnItem.paymentReference,
      inquiryAmount: txnItem.amount,
      inquiryCurrency: txnItem.currency,
      payerName: txnItem.payerName,
      contact: txnItem.contact,
      txNo: txnItem.txNo,
    };
  }

  /**
   * Map entity to response data
   */
  private mapEntityToData(
    entity: GenerateQrEntity,
    inquiry?: RetryPaymentInquiryData,
  ) {
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
      inquiry,
    };
  }
}
