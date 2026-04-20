import { NotifyPaymentRequest } from "@domain/models/generate-qr.model";
import { GenerateQrEntity } from "@infrastructure/entities/generate-qr.entity";
import { Repository } from "typeorm";
import {
  validateMultiple,
  validateText,
  validateNumber,
} from "@shared/utils/base.util";

export class NotifyPaymentValidation extends NotifyPaymentRequest {
  constructor(
    private readonly generateQrRepository: Repository<GenerateQrEntity>
  ) {
    super();
  }

  public async execute(params: NotifyPaymentRequest): Promise<void> {
    try {
      await this.buildParams(params);
      await this.validateParams();
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  private async buildParams(params: NotifyPaymentRequest): Promise<void> {
    try {
      this.notifyId = params.notifyId;
      this.processingStatus = params.processingStatus;
      this.partnerOrderID = params.partnerOrderID;
      this.partnerPaymentID = params.partnerPaymentID;
      this.paymentBank = params.paymentBank;
      this.paymentAt = params.paymentAt;
      this.paymentReference = params.paymentReference;
      this.amount = params.amount;
      this.currency = params.currency;
    } catch (error) {
      console.log("ERROR buildParams", error?.message);
      throw new Error(error?.message || "Unknown error");
    }
  }

  private async validateParams(): Promise<void> {
    try {
      const validationResults = validateMultiple({
        notifyId: validateNumber(this.notifyId, {
          required: true,
          min: 1,
        }),
        processingStatus: validateText(this.processingStatus, {
          required: true,
          minLength: 1,
          maxLength: 50,
          allowEmpty: false,
        }),
        partnerOrderID: validateText(this.partnerOrderID, {
          required: true,
          minLength: 1,
          maxLength: 255,
          allowEmpty: false,
        }),
        partnerPaymentID: validateText(this.partnerPaymentID, {
          required: true,
          minLength: 1,
          maxLength: 255,
          allowEmpty: false,
        }),
        paymentBank: validateText(this.paymentBank, {
          required: true,
          minLength: 1,
          maxLength: 100,
          allowEmpty: false,
        }),
        paymentAt: validateText(this.paymentAt, {
          required: true,
          minLength: 1,
          maxLength: 50,
          allowEmpty: false,
        }),
        paymentReference: validateText(this.paymentReference, {
          required: true,
          minLength: 1,
          maxLength: 255,
          allowEmpty: false,
        }),
        amount: validateNumber(this.amount, {
          required: true,
          min: 0,
        }),
        currency: validateText(this.currency, {
          required: true,
          minLength: 1,
          maxLength: 10,
          allowEmpty: false,
        }),
      });

      if (!validationResults.isValid) {
        const errorMessages = Object.entries(validationResults.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    } catch (error) {
      console.log("ERROR validateParams", error?.message);
      throw new Error(error?.message || "Unknown error");
    }
  }
}
