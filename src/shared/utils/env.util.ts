/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
dotenv.config();

export const ISSUER_WALLET_OWNERID = process.env.ISSUER_WALLET_OWNERID;
export const ISSUER_WALLET_OWNERID_CATEGORY =
  process.env.ISSUER_WALLET_OWNERID_CATEGORY;

export const ENCRYPT_TEXT_KEY = process.env.ENCRYPT_TEXT_KEY;
export const PROTO_WALLET_SVC_SYNC = process.env.PROTO_WALLET_SVC_SYNC;

// Backend key
export const BACKEND_KEY = process.env.BACKEND_KEY;
export const WALLET_BACKEND_KEY = process.env.WALLET_BACKEND_KEY;

// LDB QR Payment
export const LDB_CLIENT_ID = process.env.LDB_CLIENT_ID;
export const LDB_CLIENT_SECRET = process.env.LDB_CLIENT_SECRET;
export const LDB_PARTNER_ID = process.env.LDB_PARTNER_ID;
export const LDB_SIGNATURE_KEY = process.env.LDB_SIGNATURE_KEY;
export const LDB_CREATED = process.env.LDB_CREATED;
export const LDB_EXPIRES = process.env.LDB_EXPIRES;
export const LDB_URL_GEN_QR = process.env.LDB_URL_GEN_QR;
export const LDB_URL = process.env.LDB_URL;
export const LDB_BEARER_TOKEN = process.env.LDB_BEARER_TOKEN;
export const LDB_AUTH_URL = process.env.LDB_AUTH_URL;
export const LDB_URL_INQUIRY = process.env.LDB_URL_INQUIRY;