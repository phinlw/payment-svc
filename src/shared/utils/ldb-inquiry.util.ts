import axios from "axios";
import { fetchAccessToken, generateLdbHeaders } from "./ldb-header.util";
import { LDB_URL_INQUIRY } from "./env.util";

export interface InquiryTxnItem {
  processingStatus: string;
  paymentBank: string;
  paymentAt: string;
  paymentReference: string;
  amount: number;
  currency: string;
  payerName: string;
  contact: string;
  txNo: string;
}

export interface InquiryDataResponse {
  partnerOrderID: string;
  partnerPaymentID: string;
  txnItem: InquiryTxnItem[];
}

export interface InquiryPaymentResponse {
  status: string;
  message: string;
  dataResponse?: InquiryDataResponse;
}

/**
 * Call LDB inquiry API to check payment status
 * URL: {LDB_URL_INQUIRY}/vboxConsumers/api/v1/qrpayment/{transactionId}/inquiry.service?reference2={ref2}&qrType={qrType}
 */
export async function inquiryPayment(
  transactionId: string,
  ref2: string,
  qrType: string
): Promise<InquiryPaymentResponse> {
  try {
    if (!LDB_URL_INQUIRY) {
      throw new Error("LDB_URL_INQUIRY is not configured");
    }

    if (!transactionId) {
      throw new Error("transactionId is required for inquiry");
    }

    if (!ref2) {
      throw new Error("ref2 is required for inquiry");
    }

    const accessToken = await fetchAccessToken();

    const url = `${LDB_URL_INQUIRY}/vboxConsumers/api/v1/qrpayment/${transactionId}/inquiry.service`;

    const body = { reference2: ref2, qrType: qrType || "LAO_QR" };
    const ldbHeaders = generateLdbHeaders(body, accessToken);

    const response = await axios.get<InquiryPaymentResponse>(url, {
      params: {
        reference2: ref2,
        qrType: qrType || "LAO_QR",
      },
      headers: {
        "x-client-transaction-id": ldbHeaders["x-client-transaction-id"],
        "x-client-Transaction-datetime":
          ldbHeaders["x-client-Transaction-datetime"],
        partnerId: ldbHeaders.partnerId,
        digest: ldbHeaders.digest,
        signature: ldbHeaders.signature,
        "Content-Type": ldbHeaders["Content-Type"],
        Authorization: ldbHeaders.Authorization,
      },
    });

    // console.log('inquiryPayment response', response.data);

    return response.data;
  } catch (error) {
    console.error("ERROR inquiryPayment", error?.message);
    const errorMessage = error?.response?.data
      ? JSON.stringify(error.response.data)
      : error?.message || String(error);
    throw new Error(`LDB Inquiry API request failed: ${errorMessage}`);
  }
}
