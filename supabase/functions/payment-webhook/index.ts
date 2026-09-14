// Supabase Edge Function: payment-webhook
// Receives 2C2P webhook callback, verifies JWT, updates payment status in DB (triggers Supabase Realtime)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function base64url(input: Uint8Array): string {
  let binary = "";
  const len = input.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(input[i]);
  }
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
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
    const body = await req.json();
    const token = body.payload;

    if (!token) {
      throw new Error("Missing payload in webhook request");
    }

    const secretKey = Deno.env.get("2C2P_SECRET_KEY") || "CD229682D3297390B9F66FF4020B758F4A5E625AF4992E5D75D311D6458B38E2";
    const { isValid, payload } = await verifyAndDecodeJwt(token, secretKey);

    if (!isValid) {
      console.error("Invalid JWT signature received in webhook");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const invoiceNo = payload.invoiceNo;
    const respCode = payload.respCode;
    const isPaid = respCode === "0000";

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Update payment
      const { data: payment } = await supabase
        .from("payments")
        .update({
          status: isPaid ? "PAID" : "FAILED",
          gateway_ref_no: payload.tranRef || payload.transactionId,
          resp_code: respCode,
          resp_desc: payload.respDesc,
          paid_at: isPaid ? new Date().toISOString() : null,
          raw_response: payload,
        })
        .eq("invoice_no", invoiceNo)
        .select()
        .single();

      // Update booking status if paid
      if (isPaid && payment?.booking_id) {
        await supabase
          .from("bookings")
          .update({ status: "CONFIRMED" })
          .eq("id", payment.booking_id);
      }
    }

    return new Response(JSON.stringify({ success: true, invoiceNo, respCode }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
