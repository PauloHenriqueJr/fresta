import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("ABACATEPAY_WEBHOOK_SECRET");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// HMAC-SHA256 signature verification
async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const computedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)));
    
    // Constant-time comparison to prevent timing attacks
    if (signature.length !== computedSignature.length) return false;
    let result = 0;
    for (let i = 0; i < signature.length; i++) {
      result |= signature.charCodeAt(i) ^ computedSignature.charCodeAt(i);
    }
    return result === 0;
  } catch {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  // Response headers (no CORS needed for server-to-server webhooks)
  const responseHeaders = {
    "Content-Type": "application/json",
  };

  // Reject non-POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: responseHeaders }
    );
  }

  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    
    // Verify webhook signature (CRITICAL SECURITY CHECK)
    const signature = req.headers.get("x-abacatepay-signature") || req.headers.get("x-webhook-signature");
    
    if (WEBHOOK_SECRET && WEBHOOK_SECRET.length > 0) {
      if (!signature) {
        console.error("[AbacatePay Webhook] Missing signature header");
        return new Response(
          JSON.stringify({ error: "Missing signature" }),
          { status: 401, headers: responseHeaders }
        );
      }
      
      const isValid = await verifySignature(rawBody, signature, WEBHOOK_SECRET);
      if (!isValid) {
        console.error("[AbacatePay Webhook] Invalid signature");
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 401, headers: responseHeaders }
        );
      }
    } else {
      // Log warning if no secret configured (should be set in production!)
      console.warn("[AbacatePay Webhook] WARNING: No webhook secret configured. Signature verification skipped.");
    }
    
    const payload = JSON.parse(rawBody);

    // Sanitized log (don't expose full payload in production)
    console.log("[AbacatePay Webhook] Event received:", payload.event, "Order:", payload.data?.metadata?.orderId);

    const event = payload.event;
    const paymentData = payload.data;

    if (!event || !paymentData) {
      console.error("[AbacatePay Webhook] Invalid payload structure");
      return new Response(
        JSON.stringify({ error: "Invalid payload" }),
        { status: 400, headers: responseHeaders }
      );
    }

    // Extract order ID from metadata
    const orderId = paymentData.metadata?.orderId;
    const paymentId = paymentData.id;
    const paymentStatus = paymentData.status;

    if (!orderId) {
      console.error("[AbacatePay Webhook] Missing orderId in metadata");
      return new Response(
        JSON.stringify({ error: "Missing orderId in metadata" }),
        { status: 400, headers: responseHeaders }
      );
    }

    console.log(`[AbacatePay Webhook] Processing event: ${event} for order: ${orderId}`);

    // Fetch the order to verify it exists
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      console.error("[AbacatePay Webhook] Order not found:", orderId);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: responseHeaders }
      );
    }

    // Update order based on event type
    let newStatus: string;
    switch (event) {
      case "payment.paid":
        newStatus = "paid";
        break;
      case "payment.failed":
        newStatus = "failed";
        break;
      case "payment.refunded":
        newStatus = "refunded";
        break;
      default:
        console.log(`[AbacatePay Webhook] Unhandled event type: ${event}`);
        return new Response(
          JSON.stringify({ message: "Event received but not processed" }),
          { status: 200, headers: responseHeaders }
        );
    }

    // Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        gateway_payment_id: paymentId,
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("[AbacatePay Webhook] Failed to update order:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update order" }),
        { status: 500, headers: responseHeaders }
      );
    }

    console.log(`[AbacatePay Webhook] Order ${orderId} updated to status: ${newStatus}`);

    // If payment successful and calendar exists, activate it immediately
    if (newStatus === 'paid' && order.calendar_id) {
      console.log(`[AbacatePay Webhook] Activating calendar ${order.calendar_id}...`);
      
      const { error: activationError } = await supabase
        .from('calendars')
        .update({
          status: 'ativo',
          is_premium: true
        })
        .eq('id', order.calendar_id);

      if (activationError) {
        console.error(`[AbacatePay Webhook] Failed to activate calendar:`, activationError);
      } else {
        console.log(`[AbacatePay Webhook] Calendar ${order.calendar_id} activated successfully`);
      }
    }

    // If payment failed, revert calendar status back to 'ativo' (as free calendar)
    if ((newStatus === 'failed' || newStatus === 'refunded') && order.calendar_id) {
      console.log(`[AbacatePay Webhook] Reverting calendar ${order.calendar_id} to free status...`);
      
      await supabase
        .from('calendars')
        .update({
          status: 'ativo', // Back to active (free)
          // Note: don't touch is_premium - it might have been premium before
        })
        .eq('id', order.calendar_id);
    }

    // Log to audit_logs
    await supabase.from("audit_logs").insert({
      user_id: order.user_id,
      action: `webhook_${event}`,
      resource_type: "order",
      resource_id: orderId,
      metadata: {
        payment_id: paymentId,
        payment_status: paymentStatus,
        new_order_status: newStatus,
      },
    });

    // If payment was successful, client-side polling will detect and activate calendar
    // (via the Checkout.tsx useEffect that checks order status every 5 seconds)

    return new Response(
      JSON.stringify({ 
        success: true, 
        order_id: orderId,
        new_status: newStatus 
      }),
      { status: 200, headers: responseHeaders }
    );

  } catch (error) {
    console.error("[AbacatePay Webhook] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: responseHeaders }
    );
  }
});
