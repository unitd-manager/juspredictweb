// orderApi.ts
import { api } from "./api";

// -------------------------------------------------------------
// Shared Types
// -------------------------------------------------------------

export type ApiStatus = {
  type?: string;
  details?: {
    code?: string;
    message?: string;
  }[];
};

// -------------------------------------------------------------
// Order Types
// -------------------------------------------------------------

export type OrderSide = "BUY" | "SELL";
export type OrderStatus = "PENDING" | "OPEN" | "CANCELLED" | "EXITED" | "SETTLED";

export type OrderDetails = {
  orderId?: string;
  userId?: string;
  questionId?: string;
  outcomeId?: string;
  side?: OrderSide;
  quantity?: number;
  price?: number;
  status?: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
  meta?: Record<string, any>;
};

// -------------------------------------------------------------
// Payload Types
// -------------------------------------------------------------

// --- /order/v1/createorder ---
export type CreateOrderPayload = {
  userId: string;
  questionId: string;
  outcomeId: string;
  side: OrderSide;
  quantity: number;
  price?: number;
  meta?: Record<string, any>;
};

export type CreateOrderResponse = {
  status?: ApiStatus;
  orderId?: string;
};

// --- /order/v1/cancelorder ---
export type CancelOrderPayload = {
  userId: string;
  orderId: string;
};

export type CancelOrderResponse = {
  status?: ApiStatus;
  success?: boolean;
};

// --- /order/v1/details ---
export type OrderDetailsPayload = {
  userId: string;
  orderId: string;
};

export type OrderDetailsResponse = {
  status?: ApiStatus;
  order?: OrderDetails;
};

// --- /order/v1/exitorder ---
export type ExitOrderPayload = {
  userId: string;
  orderId: string;
  exitPrice?: number;
  meta?: Record<string, any>;
};

export type ExitOrderResponse = {
  status?: ApiStatus;
  success?: boolean;
};

// --- /order/v1/sendtrademsgs ---
export type SendTradeMsgsPayload = {
  orderId: string;
  userId: string;
  messageType: string; // e.g. "CONFIRMATION", "STATUS", etc.
  meta?: Record<string, any>;
};

export type SendTradeMsgsResponse = {
  status?: ApiStatus;
  success?: boolean;
};

// -------------------------------------------------------------
// API Calls
// -------------------------------------------------------------

// Create a new order
async function createOrder(payload: CreateOrderPayload) {
  return api.post<CreateOrderResponse>("/order/v1/createorder", payload);
}

// Cancel an existing order
async function cancelOrder(payload: CancelOrderPayload) {
  return api.post<CancelOrderResponse>("/order/v1/cancelorder", payload);
}

// Get order details
async function getOrderDetails(payload: OrderDetailsPayload) {
  return api.post<OrderDetailsResponse>("/order/v1/details", payload);
}

// Exit an order (close it)
async function exitOrder(payload: ExitOrderPayload) {
  return api.post<ExitOrderResponse>("/order/v1/exitorder", payload);
}

// Send trade messages (notifications, confirmations, etc.)
async function sendTradeMessages(payload: SendTradeMsgsPayload) {
  return api.post<SendTradeMsgsResponse>("/order/v1/sendtrademsgs", payload);
}

// -------------------------------------------------------------
// Export API Object
// -------------------------------------------------------------

export const orderApi = {
  createOrder,
  cancelOrder,
  getOrderDetails,
  exitOrder,
  sendTradeMessages,
};
