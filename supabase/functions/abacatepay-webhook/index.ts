import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    console.log("[AbacatePay Webhook] Received payload:", JSON.stringify(payload, null, 2));

    // AbacatePay webhook payload structure:
    // {
    //   "event": "payment.paid" | "payment.failed" | "payment.refunded",
    //   "data": {
    //     "id": "payment_id",
    //     "status": "paid" | "failed" | "refunded",
    //     "amount": 1490,
    //     "metadata": {
    //       "orderId": "uuid"
    //     }
    //   }
    // }

    const event = payload.event;
    const paymentData = payload.data;

    if (!event || !paymentData) {
      console.error("[AbacatePay Webhook] Invalid payload structure");
      return new Response(
        JSON.stringify({ error: "Invalid payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[AbacatePay Webhook] Order ${orderId} updated to status: ${newStatus}`);

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
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[AbacatePay Webhook] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
