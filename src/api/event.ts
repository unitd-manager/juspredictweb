// eventApi.ts
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

// Generic buildPageRequest (consistent with your API style)
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
// Event Types
// -------------------------------------------------------------

export type EventInfo = {
  eventId?: string;
  eventName?: string;
  eventShortName?: string;
  eventDescription?: string;
  eventType?: string;
  eventLocation?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  meta?: Record<string, any>;
};

export type GetEventPayload = {
  eventId: string;
};

export type ListEventsPayload = {
  pageRequest?: PageRequest;
  filter?: {
    eventType?: string;
    fromDate?: string;
    toDate?: string;
  };
};

export type SearchQuestionPayload = {
  searchText: string; // wildcard search
  pageRequest?: PageRequest;
};

export type StreamEventInfoPayload = {
  eventId: string;
};

// Webhook (Match score update etc.)
export type CricketWebhookPayload = {
  matchId: string;
  eventType: string;
  score?: any;
  metadata?: any;
};

// -------------------------------------------------------------
// Response Types
// -------------------------------------------------------------

export type GetEventResponse = {
  status?: ApiStatus;
  eventInfo?: EventInfo;
};

export type ListEventsResponse = {
  status?: ApiStatus;
  eventCount?: number;
  events?: EventInfo[];
};

export type SearchQuestionResponse = {
  status?: ApiStatus;
  questionCount?: number;
  questions?: {
    questionId?: string;
    questionText?: string;
    eventId?: string;
    meta?: Record<string, any>;
  }[];
};

export type StreamEventInfoResponse = {
  status?: ApiStatus;
  eventStream?: any; // event live feed info
};

// -------------------------------------------------------------
// Event API Calls
// -------------------------------------------------------------

// Cricket match webhook (server-to-server callback)
async function cricketWebhook(payload: CricketWebhookPayload) {
  return api.post("/event/v0/cricketmatch/webhook", payload);
}

// Get a single event
async function getEvent(payload: GetEventPayload) {
  return api.post<GetEventResponse>("/event/v1/getevent", payload);
}

// List events with filters + pagination
async function listEvents(payload?: ListEventsPayload) {
  return api.post<ListEventsResponse>("/event/v1/listevents", {
    ...(payload?.filter ?? {}),
    ...buildPageRequest(payload?.pageRequest),
  });
}

// Search questions using wildcard text
async function searchQuestions(payload: SearchQuestionPayload) {
  return api.post<SearchQuestionResponse>("/event/v1/searchquestion", {
    searchText: payload.searchText,
    ...buildPageRequest(payload.pageRequest),
  });
}

// Stream event info (live info)
async function streamEventInfo(payload: StreamEventInfoPayload) {
  return api.post<StreamEventInfoResponse>("/event/v1/streameventinfo", payload);
}

// -------------------------------------------------------------
// Export API Object
// -------------------------------------------------------------

export const eventApi = {
  cricketWebhook,
  getEvent,
  listEvents,
  searchQuestions,
  streamEventInfo,
};
