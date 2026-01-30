/**
 * AbacatePay Payment Service
 * Gateway de pagamento com taxa fixa de R$ 0,80 por PIX
 * Docs: https://abacatepay.com/docs
 */

import { supabase } from "@/lib/supabase/client";

// =====================
// TYPES
// =====================

export type OrderItemType = "premium" | "addon_password" | "addon_ai" | "pdf_kit";

export type OrderItem = {
  type: OrderItemType;
  name: string;
  price_cents: number;
};

export type PaymentItem = {
  type: OrderItemType;
  quantity: number;
};

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Order {
  id: string;
  created_at: string;
  user_id: string;
  calendar_id: string;
  amount_cents: number;
  currency: string;
  status: PaymentStatus;
  gateway: string;
  gateway_payment_id: string | null;
  gateway_checkout_url: string | null;
  items: OrderItem[];
  metadata: Record<string, unknown>;
}

export interface CreatePaymentParams {
  userId: string;
  calendarId: string;
  items: PaymentItem[];
  customer?: {
    cellphone?: string;
    taxId?: string;
  };
}

export interface CreatePaymentResult {
  success: boolean;
  data?: {
    orderId: string;
    checkoutUrl: string;
    pixCode?: string;
    qrCodeUrl?: string;
  };
  error?: string;
}

export interface PaymentPreference {
  orderId: string;
  checkoutUrl: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
}

// =====================
// PRICING CONFIG
// =====================

export const PRICING = {
  PREMIUM: {
    type: "premium" as const,
    name: "Calendário Premium",
    price_cents: 1490, // R$ 14,90
  },
  ADDON_PASSWORD: {
    type: "addon_password" as const,
    name: "Proteção por Senha",
    price_cents: 290, // R$ 2,90
  },
  ADDON_AI: {
    type: "addon_ai" as const,
    name: "Gerador de Textos com IA",
    price_cents: 290, // R$ 2,90
  },
  PDF_KIT: {
    type: "pdf_kit" as const,
    name: "Kit Memória Física (PDF)",
    price_cents: 990, // R$ 9,90
  },
} as const;

// =====================
// PAYMENT SERVICE
// =====================

/**
 * Helper to convert PaymentItem to OrderItem
 */
function paymentItemToOrderItem(item: PaymentItem): OrderItem {
  const priceMap: Record<OrderItemType, { name: string; price_cents: number }> = {
    premium: PRICING.PREMIUM,
    addon_password: PRICING.ADDON_PASSWORD,
    addon_ai: PRICING.ADDON_AI,
    pdf_kit: PRICING.PDF_KIT,
  };

  const info = priceMap[item.type];
  return {
    type: item.type,
    name: info.name,
    price_cents: info.price_cents * item.quantity,
  };
}

/**
 * Create a payment preference for AbacatePay
 * This creates an order in our DB and returns a checkout URL
 */
export async function createPaymentPreference(
  params: CreatePaymentParams
): Promise<CreatePaymentResult> {
  const { userId, calendarId, items } = params;

  try {
    // Convert PaymentItems to OrderItems
    const orderItems = items.map(paymentItemToOrderItem);

    // Calculate total
    const totalCents = orderItems.reduce((sum, item) => sum + item.price_cents, 0);

    // Get current user email and profile name
    const { data: { user } } = await supabase.auth.getUser();
    const customerEmail = user?.email || "cliente@fresta.com";
    
    // Fetch profile for name
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .maybeSingle();
    
    const customerName = (profile as any)?.display_name || "Cliente Fresta";
    const customerCellphone = params.customer?.cellphone || ""; 
    const customerTaxId = params.customer?.taxId || ""; 


    // Create order in database
    const { data: order, error: orderError } = await (supabase as any)
      .from("orders")
      .insert({
        user_id: userId,
        calendar_id: calendarId,
        amount_cents: totalCents,
        currency: "BRL",
        status: "pending",
        gateway: "abacatepay",
        items: orderItems,
        metadata: {
          customer_email: customerEmail,
          customer_name: customerName,
        },
      })
      .select()
      .single();

    if (orderError || !order) {
      return { success: false, error: "Erro ao criar pedido no banco de dados" };
    }

    // Create AbacatePay checkout
    const checkoutData = await createAbacatePayCheckout({
      orderId: order.id,
      amount: totalCents,
      description: `Fresta Premium - Calendário`,
      customerEmail,
      customerName,
      customerCellphone,
      customerTaxId,
      items: orderItems,
    });

    // Update order with checkout URL
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("orders")
      .update({
        gateway_checkout_url: checkoutData.url,
      })
      .eq("id", order.id);

    return {
      success: true,
      data: {
        orderId: order.id,
        checkoutUrl: checkoutData.url,
        pixCode: checkoutData.pixCode,
        qrCodeUrl: checkoutData.qrCodeUrl,
      },
    };
    } catch (error) {
      return { success: false, error: `Erro no processamento` };
    }
}

/**
 * Create AbacatePay checkout
 * Returns checkout URL and PIX data
 */
interface AbacatePayCheckoutResult {
  url: string;
  pixCode?: string;
  qrCodeUrl?: string;
}

async function createAbacatePayCheckout(params: {
  orderId: string;
  amount: number;
  description: string;
  customerEmail: string;
  customerName: string;
  customerCellphone: string;
  customerTaxId: string;
  items: OrderItem[];
}): Promise<AbacatePayCheckoutResult> {
  // Environment-based key selection
  const ENV = import.meta.env.VITE_ABACATEPAY_ENV || 'dev';
  const DEV_KEY = import.meta.env.VITE_ABACATEPAY_DEV_KEY;
  const PROD_KEY = import.meta.env.VITE_ABACATEPAY_PROD_KEY;
  
  // Use prod key if ENV is "prod", otherwise use dev key
  // Falls back to old VITE_ABACATEPAY_API_KEY for backwards compatibility
  const ABACATEPAY_API_KEY = ENV === 'prod' 
    ? (PROD_KEY || import.meta.env.VITE_ABACATEPAY_API_KEY)
    : (DEV_KEY || import.meta.env.VITE_ABACATEPAY_API_KEY);
  
  if (!ABACATEPAY_API_KEY || ABACATEPAY_API_KEY.startsWith('abc_dev_mock')) {
    console.warn("AbacatePay API key not configured or mock, using test mode");
    return {
      url: `${window.location.origin}/#/pagamento/sucesso?order=${params.orderId}&mock=true`,
      pixCode: "00020126330014BR.GOV.BCB.PIX0111mock_pix_code520400005303986540510.005802BR5925FRESTA",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=mock_pix_code",
    };
  }

  try {
    const payload = {
      amount: params.amount,
      description: params.description,
      customer: {
        name: params.customerName,
        cellphone: params.customerCellphone,
        email: params.customerEmail,
        taxId: params.customerTaxId,
      },
      metadata: {
        orderId: params.orderId,
      },
    };

    const response = await fetch("https://api.abacatepay.com/v1/pixQrCode/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ABACATEPAY_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const resBody = await response.json();

    if (!response.ok || resBody.success === false) {
      console.error("AbacatePay API Error Status:", response.status);
      console.error("AbacatePay API Error Body:", resBody);
      
      const errorDetail = resBody.error || resBody.message || JSON.stringify(resBody);
      throw new Error(`AbacatePay Error (${response.status}): ${errorDetail}`);
    }

    const pixData = resBody.data;

    if (!pixData || !pixData.brCodeBase64) {
      console.error("AbacatePay API Invalid Response:", resBody);
      throw new Error("AbacatePay retornou uma resposta sem dados do PIX.");
    }

    return {
      url: "", // pixQrCode endpoint doesn't return a checkout URL, only direct PIX
      pixCode: pixData.brCode,
      qrCodeUrl: pixData.brCodeBase64,
    };
  } catch (error) {
    console.error("AbacatePay Checkout Exception:", error);
    throw error;
  }
}

/**
 * Verify payment status by order ID
 * Called after redirecting back from AbacatePay
 */
export async function verifyPaymentStatus(orderId: string): Promise<Order | null> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    console.error("Error fetching order:", error);
    return null;
  }

  return order as Order;
}

/**
 * Mark calendar as premium after successful payment
 * Should be called by webhook handler
 */
export async function activatePremiumCalendar(
  calendarId: string,
  addons: string[] = []
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).rpc("mark_calendar_premium", {
    _calendar_id: calendarId,
    _addons: addons,
  });

  if (error) {
    console.error("Error activating premium:", error);
    return false;
  }

  return true;
}

/**
 * Get user's orders
 */
export async function getUserOrders(): Promise<Order[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: orders, error } = await (supabase as any)
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return orders as Order[];
}

/**
 * Check if calendar is premium
 */
export async function isCalendarPremium(calendarId: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("calendars")
    .select("is_premium")
    .eq("id", calendarId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.is_premium === true;
}
