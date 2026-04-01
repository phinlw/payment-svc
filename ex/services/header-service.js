const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

function generateHeaders(body) {
  // console.log(JSON.stringify(body));
  const transactionId = uuidv4();
  const transactionDatetime = getTxnDateTimeISO8601();

  // console.log("transactionId: ", transactionId);
  const bodyString = JSON.stringify(body);
  // console.log("body", bodyString);
  const digestHash = crypto
    .createHash("sha256")
    .update(bodyString)
    .digest("base64");

  const digest = `SHA-256=${digestHash}`;

  // console.log("digest: ", digest);

  const signingString =
    `digest: ${digest}\n` +
    `(request-target): post ${process.env.LDB_URL_GEN_QR}\n` +
    `(created): ${process.env.LDB_CREATED}\n` +
    `x-client-transaction-id: ${transactionId}`;

  const signatureValue = crypto
    .createHmac("sha256", process.env.LDB_SIGNATURE_KEY)
    .update(signingString)
    .digest("base64");

  const signature = `keyId="key1",algorithm="hs2019",created=${process.env.LDB_CREATED},expires=${process.env.LDB_EXPIRES},headers="digest (request-target) (created) x-client-transaction-id",signature="${signatureValue}"`;

  // console.log("signature: ", signature);

  return {
    "x-client-transaction-id": transactionId,
    "x-client-transaction-datetime": transactionDatetime,
    digest,
    signature,
    bodyString,
  };
}

function getTxnDateTimeISO8601() {
  const now = new Date();

  // helper to pad numbers
  const pad = (num, size = 2) => String(num).padStart(size, "0");

  // convert UTC to +07:00 (Laos time)
  const offset = 7 * 60; // minutes
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

// Usage
const txnDateTimeISO8601 = getTxnDateTimeISO8601();
console.log(txnDateTimeISO8601);

module.exports = { generateHeaders, getTxnDateTimeISO8601 };
