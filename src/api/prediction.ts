// predictionApi.ts
import { api } from "./api";

// -------------------------------------------------------------
// Shared Types
// -------------------------------------------------------------

export type ApiStatus = {
  type?: string;
  details?: { code?: string; message?: string }[];
};

export type PageRequest = {
  pageNumber?: number;
  pageSize?: number;
};

const DEFAULT_PAGE_REQUEST: Required<PageRequest> = {
  pageNumber: 1,
  pageSize: 20,
};

const buildPageRequest = (pageRequest?: PageRequest) => ({
  pageRequest: {
    pageNumber: pageRequest?.pageNumber ?? DEFAULT_PAGE_REQUEST.pageNumber,
    pageSize: pageRequest?.pageSize ?? DEFAULT_PAGE_REQUEST.pageSize,
  },
});

// -------------------------------------------------------------
// Prediction Core Types
// -------------------------------------------------------------

export type PredictionStatus =
  | "PENDING"
  | "CORRECT"
  | "WRONG"
  | "CANCELLED"
  | "IN_PROGRESS";

export type UserPrediction = {
  predictionId?: string;
  userId?: string;
  eventId?: string;
  questionId?: string;
  selectedOutcomeId?: string;
  stakeAmount?: number;
  potentialReturn?: number;
  status?: PredictionStatus;
  createdAt?: string;
  settledAt?: string;
  meta?: Record<string, any>;
};

// -------------------------------------------------------------
// API Payloads
// -------------------------------------------------------------

// --- /prediction/v1/add ---
export type AddPredictionPayload = {
  userId: string;
  eventId: string;
  questionId: string;
  selectedOutcomeId: string;

  // 🔴 REQUIRED BY PROTO
  percentage: string;
  invested_amount: string;
  prediction_cost: string;

  meta?: Record<string, any>;
};

// --- /prediction/v1/get ---
export type GetUserPredictionsPayload = {
  userId: string;
  pageRequest?: PageRequest;
  timeInForce?: string;
};

// --- /prediction/v1/getbyid ---
export type GetPredictionByIdPayload = {
  predictionId: string;
  userId: string;
  
};

// --- /prediction/v1/getbyquestion ---
export type GetPredictionsByQuestionPayload = {
  questionId: string;
  userIds: string[];
  pageRequest?: PageRequest;
};

// --- /prediction/v1/performance ---
export type PredictionPerformancePayload = {
 
  timeInForce: string;
};

// --- /prediction/v1/search ---
export type SearchPredictionsPayload = {
  userId: string;
  searchText?: string;        // event name or status
  status?: PredictionStatus;
  pageRequest?: PageRequest;
};

// --- /prediction/v1/settle ---
export type SettlePredictionPayload = {
  predictionId: string;
  resultOutcomeId: string;
  isCorrect: boolean;
  earnedAmount?: number;
};

// -------------------------------------------------------------
// API Response Types
// -------------------------------------------------------------

export type AddPredictionResponse = {
  status?: ApiStatus;
  predictionId?: string;
};

export type GetUserPredictionsResponse = {
  status?: ApiStatus;
  predictionCount?: number;
  predictions?: UserPrediction[];
};

export type GetPredictionByIdResponse = {
  status?: ApiStatus;
  prediction?: UserPrediction;
};

export type GetPredictionsByQuestionResponse = {
  status?: ApiStatus;
  predictionCount?: number;
  predictions?: UserPrediction[];
};

export type PredictionPerformance = {
  totalPredictions?: number;
  correctPredictions?: number;
  wrongPredictions?: number;
  accuracy?: number;          // percentage
  earnings?: number;
};

export type PredictionPerformanceResponse = {
  status?: ApiStatus;
  performance?: PredictionPerformance;
};

export type SearchPredictionsResponse = {
  status?: ApiStatus;
  predictionCount?: number;
  predictions?: UserPrediction[];
};

export type SettlePredictionResponse = {
  status?: ApiStatus;
  success?: boolean;
};

export interface GetPnLPayload {
  pnlType: "PNLTYPE_REALIZED" | "PNLTYPE_UNREALIZED";
  timeSince?: string; // optional – if omitted, inception PnL
}

export interface GetPnLResponse {
  pnl: number;
}


// -------------------------------------------------------------
// API Calls
// -------------------------------------------------------------

// Add new prediction
async function addPrediction(payload: AddPredictionPayload) {
  return api.post<AddPredictionResponse>("/prediction/v1/add", payload);
}

// Get all predictions for a user
async function getUserPredictions(payload: GetUserPredictionsPayload) {
  return api.post<GetUserPredictionsResponse>("/prediction/v1/get", {
    ...buildPageRequest(payload.pageRequest),
    day: 0,
    month: 0,
    year: 0,
    timeInForce: payload.timeInForce,
    userId: payload.userId,
  });
}

// Get specific prediction by ID
async function getPredictionById(payload: GetPredictionByIdPayload) {
  return api.post<GetPredictionByIdResponse>("/prediction/v1/getbyid", payload);
}

// Get predictions for multiple users on one question
async function getPredictionsByQuestion(payload: GetPredictionsByQuestionPayload) {
  return api.post<GetPredictionsByQuestionResponse>("/prediction/v1/getbyquestion", {
    questionId: payload.questionId,
    userIds: payload.userIds,
    ...buildPageRequest(payload.pageRequest),
  });
}

// Get user's performance summary
async function getPredictionPerformance(payload: PredictionPerformancePayload) {
  return api.post<PredictionPerformanceResponse>("/prediction/v1/performance", payload);
}

// Search predictions by event name or status
async function searchPredictions(payload: SearchPredictionsPayload) {
  return api.post<SearchPredictionsResponse>("/prediction/v1/search", {
    userId: payload.userId,
    searchText: payload.searchText,
    status: payload.status,
    ...buildPageRequest(payload.pageRequest),
  });
}

// Settle a prediction
async function settlePrediction(payload: SettlePredictionPayload) {
  return api.post<SettlePredictionResponse>("/prediction/v1/settle", payload);
}

// Get PnL
async function getPnL(payload: GetPnLPayload) {
  return api.post<GetPnLResponse>("/prediction/v1/pnl", {
    pnlType: payload.pnlType,
    ...(payload.timeSince ? { timeSince: payload.timeSince } : {}),
  });
}

// -------------------------------------------------------------
// Export API Object
// -------------------------------------------------------------

export const predictionApi = {
  addPrediction,
  getUserPredictions,
  getPredictionById,
  getPredictionsByQuestion,
  getPredictionPerformance,
  searchPredictions,
  settlePrediction,
  getPnL,
};
