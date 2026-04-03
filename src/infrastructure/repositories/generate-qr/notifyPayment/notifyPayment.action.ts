import { QueryRunner } from 'typeorm';
import { NotifyPaymentRequest, NotifyPaymentResponse } from '@domain/models/generate-qr.model';
import { GenerateQrEntity, GenerateQrStatus } from '@infrastructure/entities/generate-qr.entity';

export class NotifyPaymentAction {
  private partnerOrderID: string;
  private partnerPaymentID: string;
  private amount: number;

  constructor(private readonly session: QueryRunner) {}

  public async execute(params: NotifyPaymentRequest): Promise<NotifyPaymentResponse> {
    try {
      this.buildParams(params);
      await this.performNotifyPayment();
      return this.buildResponse();
    } catch (error) {
      console.error('ERROR NotifyPaymentAction.execute', error?.message);
      throw error instanceof Error ? error : new Error(error?.message || String(error));
    }
  }

  /**
   * Build parameters
   */
  private buildParams(params: NotifyPaymentRequest): void {
    this.partnerOrderID = params.partnerOrderID;
    this.partnerPaymentID = params.partnerPaymentID;
    this.amount = params.amount;
  }

  /**
   * Find QR record by ref1 (partnerOrderID) and update status to COMPLETE
   */
  private async performNotifyPayment(): Promise<void> {
    try {
      const entity = await this.session.manager.findOne(GenerateQrEntity, {
        where: { ref2: this.partnerPaymentID },
      });

      if (!entity) {
        throw new Error(`QR record not found for partnerOrderID: ${this.partnerOrderID}`);
      }

      if (entity.status === GenerateQrStatus.COMPLETE) {
        throw new Error(`QR record already completed for partnerOrderID: ${this.partnerOrderID}`);
      }

      await this.session.manager.update(
        GenerateQrEntity,
        { _id: entity._id },
        { status: GenerateQrStatus.COMPLETE, updatedAt: new Date() },
      );
    } catch (error) {
      console.error('ERROR performNotifyPayment', error?.message);
      throw new Error(`Failed to perform notifyPayment: ${error?.message || String(error)}`);
    }
  }

  /**
   * Build response object
   */
  private buildResponse(): NotifyPaymentResponse {
    return {
      code: 200,
      status: 'OK',
      message: 'Successful.',
    };
  }
}
