// Supabase Edge Function: create-payment
// Signs 2C2P request with HS256 JWT and requests payment token from sandbox

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function base64url(input: Uint8Array | string): string {
  let str = "";
  if (typeof input === "string") {
    str = btoa(unescape(encodeURIComponent(input)));
  } else {
    let binary = "";
    const len = input.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(input[i]);
    }
    str = btoa(binary);
  }
  return str.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function hmacSha256(key: string, data: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return new Uint8Array(signature);
}

async function signJwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const sigBytes = await hmacSha256(secret, signatureInput);
  const encodedSignature = base64url(sigBytes);
  return `${signatureInput}.${encodedSignature}`;
}

async function verifyAndDecodeJwt(token: string, secret: string) {
  const [headerB64, payloadB64, signatureB64] = token.split(".");
  const signatureInput = `${headerB64}.${payloadB64}`;
  const sigBytes = await hmacSha256(secret, signatureInput);
  const expectedSig = base64url(sigBytes);
  const isValid = signatureB64 === expectedSig;
  const payloadJson = decodeURIComponent(escape(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))));
  return { isValid, payload: JSON.parse(payloadJson) };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { bookingId, amount, description, currency = "THB" } = await req.json();

    const merchantID = Deno.env.get("2C2P_MERCHANT_ID") || "JT04";
    const secretKey = Deno.env.get("2C2P_SECRET_KEY") || "CD229682D3297390B9F66FF4020B758F4A5E625AF4992E5D75D311D6458B38E2";
    const invoiceNo = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const paymentPayload = {
      merchantID,
      invoiceNo,
      description: description || "Farewell to Stairway - Memorial Booking",
      amount: Number(amount),
      currencyCode: currency,
    };

    const signedJwt = await signJwt(paymentPayload, secretKey);

    const response = await fetch("https://sandbox-pgw.2c2p.com/payment/4.3/paymentToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: signedJwt }),
    });

    const resData = await response.json();
    if (!resData.payload) {
      throw new Error(`2C2P Gateway Error: ${JSON.stringify(resData)}`);
    }

    const { isValid, payload: decodedResponse } = await verifyAndDecodeJwt(resData.payload, secretKey);

    // Record into database if supabase client is configured
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && supabaseKey && bookingId) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("payments").insert({
        booking_id: bookingId,
        invoice_no: invoiceNo,
        amount: Number(amount),
        currency,
        payment_token: decodedResponse.paymentToken,
        web_payment_url: decodedResponse.webPaymentUrl,
        resp_code: decodedResponse.respCode,
        resp_desc: decodedResponse.respDesc,
        status: "PENDING",
        raw_response: decodedResponse,
      });
    }

    return new Response(
      JSON.stringify({
        success: decodedResponse.respCode === "0000",
        invoiceNo,
        webPaymentUrl: decodedResponse.webPaymentUrl,
        paymentToken: decodedResponse.paymentToken,
        respCode: decodedResponse.respCode,
        respDesc: decodedResponse.respDesc,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
