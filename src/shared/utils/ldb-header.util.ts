import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import {
  LDB_SIGNATURE_KEY,
  LDB_CREATED,
  LDB_EXPIRES,
  LDB_URL_GEN_QR,
  LDB_PARTNER_ID,
  LDB_BEARER_TOKEN,
  LDB_URL,
  LDB_AUTH_URL,
  LDB_CLIENT_ID,
  LDB_CLIENT_SECRET,
} from './env.util';
import axios from 'axios';

export interface LdbHeaders {
  'x-client-transaction-id': string;
  'x-client-Transaction-datetime': string;
  partnerId: string;
  digest: string;
  signature: string;
  'Content-Type': string;
  Authorization: string;
}

function getTxnDateTimeISO8601(): string {
  const now = new Date();

  const pad = (num: number, size = 2) => String(num).padStart(size, '0');

  const offset = 7 * 60;
  const localTime = new Date(now.getTime() + offset * 60 * 1000);

  const year = localTime.getUTCFullYear();
  const month = pad(localTime.getUTCMonth() + 1);
  const day = pad(localTime.getUTCDate());
  const hours = pad(localTime.getUTCHours());
  const minutes = pad(localTime.getUTCMinutes());
  const seconds = pad(localTime.getUTCSeconds());
  const millis = pad(localTime.getUTCMilliseconds(), 3);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${millis}+0700`;
}

export async function fetchAccessToken(): Promise<string> {
  try {
    const authUrl = LDB_AUTH_URL;
    if (!authUrl) {
      throw new Error('LDB_AUTH_URL is not configured');
    }

    const credentials = Buffer.from(`${LDB_CLIENT_ID}:${LDB_CLIENT_SECRET}`).toString('base64');

    const response = await axios.post(
      authUrl,
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
      },
    );

    if (!response.data?.access_token) {
      throw new Error('No access_token in response');
    }

    return response.data.access_token;
  } catch (error) {
    console.error('ERROR fetchAccessToken', error?.message);
    throw new Error(`Failed to fetch access token: ${error?.message || String(error)}`);
  }
}

export function generateLdbHeaders(body: any, accessToken?: string): LdbHeaders {
  const transactionId = uuidv4();
  const transactionDatetime = getTxnDateTimeISO8601();

  const bodyString = JSON.stringify(body);
  const digestHash = crypto
    .createHash('sha256')
    .update(bodyString)
    .digest('base64');

  const digest = `SHA-256=${digestHash}`;

  const signingString =
    `digest: ${digest}\n` +
    `(request-target): post ${LDB_URL_GEN_QR}\n` +
    `(created): ${LDB_CREATED}\n` +
    `x-client-transaction-id: ${transactionId}`;

  const signatureValue = crypto
    .createHmac('sha256', LDB_SIGNATURE_KEY || '')
    .update(signingString)
    .digest('base64');

  const signature = `keyId="key1",algorithm="hs2019",created=${LDB_CREATED},expires=${LDB_EXPIRES},headers="digest (request-target) (created) x-client-transaction-id",signature="${signatureValue}"`;

  return {
    'x-client-transaction-id': transactionId,
    'x-client-Transaction-datetime': transactionDatetime,
    partnerId: LDB_PARTNER_ID || '',
    digest,
    signature,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken || LDB_BEARER_TOKEN}`,
  };
}

export function getLdbApiUrl(): string {
  return LDB_URL || '';
}
