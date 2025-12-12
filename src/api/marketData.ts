// marketDataApi.ts
import { api } from "./api";

// -------------------------------------------------------------
// Types
// -------------------------------------------------------------

export type ApiStatus = {
  type?: string;
  details?: { code?: string; message?: string }[];
};

// Request types
export type GetMarketDataPayload = {
  questionId: string;
};

export type GetAllMarketDataPayload = {
  questionId: string;
};

export type PublishMarketDataPayload = {
  questionId: string;
  outcomeId?: string;          // Market outcome (if specific)
  price?: number;              // Market price
  probability?: number;        // Market probability
  liquidity?: number;          // Liquidity (if applicable)
  meta?: Record<string, any>;  // Additional data
};

// Response types
export type MarketData = {
  outcomeId?: string;
  questionId?: string;
  price?: number;
  probability?: number;
  liquidity?: number;
  lastUpdated?: string;
  meta?: Record<string, any>;
};

export type GetMarketDataResponse = {
  status?: ApiStatus;
  marketData?: MarketData;
};

export type GetAllMarketDataResponse = {
  status?: ApiStatus;
  marketDataList?: MarketData[];
};

export type PublishMarketDataResponse = {
  status?: ApiStatus;
  success?: boolean;
};

// -------------------------------------------------------------
// API Functions
// -------------------------------------------------------------

// Get single outcome market data for a question
async function getMarketData(payload: GetMarketDataPayload) {
  return api.post<GetMarketDataResponse>("/marketdata/v1/get", payload);
}

// Get all outcomes market data for a question
async function getAllMarketData(payload: GetAllMarketDataPayload) {
  return api.post<GetAllMarketDataResponse>("/marketdata/v1/getall", payload);
}

// Publish / Update market data
async function publishMarketData(payload: PublishMarketDataPayload) {
  return api.post<PublishMarketDataResponse>("/marketdata/v1/publish", payload);
}

// -------------------------------------------------------------
// Export object
// -------------------------------------------------------------

export const marketDataApi = {
  getMarketData,
  getAllMarketData,
  publishMarketData,
};
