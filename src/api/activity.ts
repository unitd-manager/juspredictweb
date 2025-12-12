// activityApi.ts
import { api } from "./api";

// -------------------------------------------------------------
// Types
// -------------------------------------------------------------

export type ApiStatus = {
  type?: string;
  details?: { code?: string; message?: string }[];
};

export type PageRequest = {
  pageNumber?: number;
  pageSize?: number;
};

export type CreateActivityPayload = {
  userId: string;
  activityType: string;     // e.g., "CLAN", "PREDICTION", "REWARD"
  referenceId?: string;     // clanId, predictionId, rewardId etc
  description?: string;
  amount?: number;          // optional (for transactions)
  meta?: Record<string, any>;
};

export type GetUserActivityPayload = {
  userId: string;
  pageRequest?: PageRequest;
};

export type GetTransactionsPayload = {
  userId: string;
  pageRequest?: PageRequest;
};

// Returned activity record
export type ActivityRecord = {
  activityId?: string;
  userId?: string;
  activityType?: string;
  referenceId?: string;
  description?: string;
  amount?: number;
  createdAt?: string;
  meta?: Record<string, any>;
};

// Response structures
export type CreateActivityResponse = {
  status?: ApiStatus;
  activityId?: string;
};

export type GetActivityListResponse = {
  status?: ApiStatus;
  activityCount?: number;
  activities?: ActivityRecord[];
};

export interface GetTransactionsResponse {
  activities?: {
    activityAmount?: string;
    activityDescription?: string;
    activityId?: string;
    activitySubType?: string;
    activityTime?: string;
    activityType?: string;
  }[];

  activitiesCount?: number;

  pageInfo?: {
    currentPage?: number;
    pageSize?: number;
    totalPages?: number;
    totalRecords?: number;
  };

  status?: {
    type?: string;
    details?: { code?: string; message?: string; type?: string }[];
  };
}


// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------

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
// API Calls
// -------------------------------------------------------------

async function createActivity(payload: CreateActivityPayload) {
  return api.post<CreateActivityResponse>("/activity/v1/create", payload);
}

async function getUserActivity(payload: GetUserActivityPayload) {
  return api.post<GetActivityListResponse>("/activity/v1/getbyuser", {
    userId: payload.userId,
    ...buildPageRequest(payload.pageRequest),
  });
}

async function getTransactions(payload: GetTransactionsPayload) {
  return api.post<GetTransactionsResponse>("/activity/v1/transactions", {
    userId: payload.userId,
    ...buildPageRequest(payload.pageRequest),
  });
}

// -------------------------------------------------------------
// Exported API object
// -------------------------------------------------------------

export const activityApi = {
  createActivity,
  getUserActivity,
  getTransactions,
};
