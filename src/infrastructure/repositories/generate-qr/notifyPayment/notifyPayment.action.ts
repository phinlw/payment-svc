import { QueryRunner } from "typeorm";
import {
  NotifyPaymentRequest,
  NotifyPaymentResponse,
} from "@domain/models/generate-qr.model";
import {
  GenerateQrEntity,
  GenerateQrStatus,
} from "@infrastructure/entities/generate-qr.entity";
import {
  inquiryPayment,
  InquiryTxnItem,
  InquiryPaymentResponse,
} from "@shared/utils/ldb-inquiry.util";
import axios from "axios";

const GRAPHQL_CALLBACK_URL = "http://202.137.130.93:7050/api-gateway";

interface CallInquiryResult {
  success: boolean;
  txnItem?: InquiryTxnItem;
  inquiryStatus?: string;
  inquiryMessage?: string;
}

export class NotifyPaymentAction {
  private partnerOrderID: string;
  private partnerPaymentID: string;
  private paymentReference: string;
  private amount: number;

  constructor(private readonly session: QueryRunner) {}

  public async execute(
    params: NotifyPaymentRequest
  ): Promise<NotifyPaymentResponse> {
    try {
      // console.log("param====>", params);

      this.buildParams(params);
      await this.performNotifyPayment();
      return this.buildResponse();
    } catch (error: any) {
      console.error("ERROR NotifyPaymentAction.execute", error?.message);
      throw error instanceof Error
        ? error
        : new Error(error?.message || String(error));
    }
  }

  /**
   * Build parameters
   */
  private buildParams(params: NotifyPaymentRequest): void {
    this.partnerOrderID = params.partnerOrderID;
    this.partnerPaymentID = params.partnerPaymentID;
    this.paymentReference = params.paymentReference;
    this.amount = params.amount;
  }

  /**
   * Find QR record by partnerOrderID and update status to COMPLETE
   * LDB sends partnerOrderID as "ite" + UUID-without-dashes
   * DB stores transactionId as UUID-with-dashes
   */
  private async performNotifyPayment(): Promise<void> {
    try {
      // console.log("DEBUG performNotifyPayment searching with:", {
      //   partnerOrderID: this.partnerOrderID,
      //   partnerPaymentID: this.partnerPaymentID,
      // });

      let entity: GenerateQrEntity | null = null;

      // Direct match on _id
      entity = await this.session.manager.findOne(GenerateQrEntity, {
        where: { ref2: this.paymentReference },
      });

      // Direct match on transactionId
      if (!entity) {
        entity = await this.session.manager.findOne(GenerateQrEntity, {
          where: { transactionId: this.partnerOrderID },
        });
      }

      if (!entity) {
        throw new Error(
          `QR record not found for partnerOrderID: ${this.partnerOrderID}`
        );
      }

      if (entity.status === GenerateQrStatus.COMPLETE) {
        // await this.callGraphQLCallback(entity);
        console.log(
          `QR record already completed for partnerOrderID: ${this.partnerOrderID}, skipping.`
        );
        return;
      }

      // Call LDB inquiry API to verify payment status
      const inquiryResult = await this.callInquiry(entity);
      // console.log("inquiryResult====>", inquiryResult);

      if (!inquiryResult?.success || !inquiryResult.txnItem) {
        console.log("DEBUG inquiry failed:", inquiryResult);
        return;
      }

      const txnItem = inquiryResult.txnItem;
      console.log("DEBUG inquiry result:", {
        processingStatus: txnItem.processingStatus,
        paymentBank: txnItem.paymentBank,
        amount: txnItem.amount,
      });

      await this.session.manager.update(
        GenerateQrEntity,
        { _id: entity._id },
        { status: GenerateQrStatus.COMPLETE, updatedAt: new Date() }
      );
      // Fire-and-forget: do not block the response on the GraphQL callback
      void this.callGraphQLCallback(entity);
    } catch (error: any) {
      console.error("ERROR performNotifyPayment", error?.message);
      throw new Error(
        `Failed to perform notifyPayment: ${error?.message || String(error)}`
      );
    }
  }

  /**
   * Call LDB inquiry API using entity transactionId, ref2, and qrType
   */
  private async callInquiry(
    entity: GenerateQrEntity
  ): Promise<CallInquiryResult> {
    try {
      const transactionId = entity.transactionId;
      const ref2 = entity.ref2;
      const qrType = entity.qrType || "LAO_QR";

      if (!transactionId || !ref2) {
        console.error("ERROR callInquiry: missing transactionId or ref2", {
          transactionId,
          ref2,
        });
        return {
          success: false,
          inquiryStatus: "INQUIRY_FAILED",
          inquiryMessage: `Missing transactionId or ref2 for partnerOrderID: ${this.partnerOrderID}`,
        };
      }

      const inquiryResponse = await inquiryPayment(transactionId, ref2, qrType);

      if (inquiryResponse.status !== "00") {
        return {
          success: false,
          inquiryStatus: inquiryResponse.status,
          inquiryMessage: inquiryResponse.message,
        };
      }

      const txnItems = inquiryResponse.dataResponse?.txnItem;
      if (!txnItems || txnItems.length === 0) {
        console.error("ERROR callInquiry: no txnItem found");
        return {
          success: false,
          inquiryStatus: "INQUIRY_EMPTY",
          inquiryMessage: "Inquiry returned no transaction items",
        };
      }

      return { success: true, txnItem: txnItems[0] };
    } catch (error: any) {
      console.error("ERROR callInquiry", error?.message);
      return {
        success: false,
        inquiryStatus: "INQUIRY_ERROR",
        inquiryMessage: error?.message || String(error),
      };
    }
  }

  /**
   * Call GraphQL callback to notify upstream service of payment confirmation
   */
  private async callGraphQLCallback(entity: GenerateQrEntity): Promise<void> {
    try {
      const mutation = `
        mutation UpdateCallbackConfirmTopupBankQR($input: UpdateCallbackConfirmTopupBankQRDto!) {
          updateCallbackConfirmTopupBankQR(input: $input) {
          generateId
          amount
          description
          tag
          createdAt
          remainAmount
          uniqueId
          method
          }
        }
      `;

      const variables = {
        input: {
          callbackKey: entity.callbackKey,
          referenceId: entity._id,
        },
      };

      // console.log(variables);

      const response = await axios.post(
        GRAPHQL_CALLBACK_URL,
        { query: mutation, variables },
        {
          headers: {
            'Content-Type': 'application/json',
            backendKey: '951ea066-48ab-490a-894c-d769f80d4653',
            platform: 'wallet_svc',
          },
        },
      );

      const data = response.data;
      // console.log("data GraphQL====>", data);

      if (data?.errors) {
        console.error(
          'GraphQL callback returned errors:',
          JSON.stringify(data.errors, null, 2),
        );
      } else {
        console.log('GraphQL callback response:', JSON.stringify(data));
        return;
      }
    } catch (error: any) {
      const gqlErrors = error.response?.data?.errors;
      if (gqlErrors) {
        console.error(
          "ERROR callGraphQLCallback GraphQL errors:",
          JSON.stringify(gqlErrors, null, 2)
        );
      } else {
        console.error(
          "ERROR callGraphQLCallback",
          error?.message,
          "response body:",
          JSON.stringify(error.response?.data)
        );
      }
    }
  }

  /**
   * Build response object
   */
  private buildResponse(): NotifyPaymentResponse {
    return {
      code: 200,
      status: "OK",
      message: "Successful.",
    };
  }
}
