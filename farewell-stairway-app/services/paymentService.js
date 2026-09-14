// 2C2P Payment Service for Farewell to Stairway
// Uses verified Thailand Sandbox credentials (JT04) and HMAC-SHA256 JWT signing

import CryptoJS from 'crypto-js';

const MERCHANT_ID = 'JT04';
const SECRET_KEY = 'CD229682D3297390B9F66FF4020B758F4A5E625AF4992E5D75D311D6458B38E2';
const SANDBOX_ENDPOINT = 'https://sandbox-pgw.2c2p.com/payment/4.3/paymentToken';

function base64url(source) {
  let encodedSource = CryptoJS.enc.Base64.stringify(source);
  encodedSource = encodedSource.replace(/=+$/, '');
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');
  return encodedSource;
}

export async function create2C2PPaymentToken({ amount, description, invoiceNo }) {
  const invoice = invoiceNo || `INV${Date.now()}`;
  
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    merchantID: MERCHANT_ID,
    invoiceNo: invoice,
    description: description || 'Farewell to Stairway - Pet Memorial Booking',
    amount: Number(amount),
    currencyCode: 'THB'
  };

  const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
  const encodedHeader = base64url(stringifiedHeader);

  const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
  const encodedData = base64url(stringifiedData);

  const token = `${encodedHeader}.${encodedData}`;
  const signature = CryptoJS.HmacSHA256(token, SECRET_KEY);
  const encodedSignature = base64url(signature);

  const signedJwt = `${token}.${encodedSignature}`;

  // Call 2C2P Sandbox
  const response = await fetch(SANDBOX_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ payload: signedJwt })
  });

  const resData = await response.json();
  if (!resData.payload) {
    throw new Error('No payload returned from 2C2P Sandbox');
  }

  // Decode response JWT
  const parts = resData.payload.split('.');
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const decodedJson = decodeURIComponent(escape(atob(base64)));
  const decodedPayload = JSON.parse(decodedJson);

  return {
    success: decodedPayload.respCode === '0000',
    invoiceNo: invoice,
    paymentToken: decodedPayload.paymentToken,
    webPaymentUrl: decodedPayload.webPaymentUrl,
    respCode: decodedPayload.respCode,
    respDesc: decodedPayload.respDesc
  };
}
