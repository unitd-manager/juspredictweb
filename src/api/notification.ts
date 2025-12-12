// notificationApi.ts
import { api } from "./api";

// -------------------------------------------------------------
// Shared Types
// -------------------------------------------------------------

export type ApiStatus = {
  type?: string;
  details?: { code?: string; message?: string }[];
};

export type NotificationStatus = "READ" | "UNREAD" | "DELETED" | "ARCHIVED";

// Notification message structure
export type NotificationMessage = {
  messageId?: string;
  userId?: string;
  title?: string;
  message?: string;
  createdAt?: string;
  status?: NotificationStatus;
  meta?: Record<string, any>;
};

// -------------------------------------------------------------
// Payload Types
// -------------------------------------------------------------

// --- POST /notification/v1/create ---
export type CreateNotificationPayload = {
  userId: string;
  title: string;
  message: string;
  meta?: Record<string, any>;
};

export type CreateNotificationResponse = {
  status?: ApiStatus;
  messageId?: string;
};

// --- POST /notification/v1/getlist ---
export type GetNotificationListPayload = {
  userId: string;
  includeRead?: boolean;
  includeDeleted?: boolean;
  includeArchived?: boolean;
  limit?: number;
};

export type GetNotificationListResponse = {
  status?: ApiStatus;
  notifications?: NotificationMessage[];
};

// --- POST /notification/v1/markmessages ---
export type MarkMessagesPayload = {
  userId: string;
  messageIds: string[];                 // IDs to update
  status: NotificationStatus;           // READ / DELETED / ARCHIVED
};

export type MarkMessagesResponse = {
  status?: ApiStatus;
  success?: boolean;
};

// --- POST /notification/v1/unreadcount ---
export type UnreadCountPayload = {
  userId: string;
};

export type UnreadCountResponse = {
  status?: ApiStatus;
  unreadCount?: number;
};

// --- POST /notification/v1/update ---
export type UpdateNotificationPayload = {
  messageId: string;
  userId: string;
  title?: string;
  message?: string;
  status?: NotificationStatus;
  meta?: Record<string, any>;
};

export type UpdateNotificationResponse = {
  status?: ApiStatus;
  success?: boolean;
};

// -------------------------------------------------------------
// API Calls
// -------------------------------------------------------------

// Create a notification
async function create(payload: CreateNotificationPayload) {
  return api.post<CreateNotificationResponse>("/notification/v1/create", payload);
}

// Get user's notifications
async function getList(payload: GetNotificationListPayload) {
  return api.post<GetNotificationListResponse>("/notification/v1/getlist", payload);
}

// Mark messages as Read, Deleted, Archived
async function markMessages(payload: MarkMessagesPayload) {
  return api.post<MarkMessagesResponse>("/notification/v1/markmessages", payload);
}

// Get unread count for a user
async function unreadCount(payload: UnreadCountPayload) {
  return api.post<UnreadCountResponse>("/notification/v1/unreadcount", payload);
}

// Update an existing notification
async function update(payload: UpdateNotificationPayload) {
  return api.post<UpdateNotificationResponse>("/notification/v1/update", payload);
}

// -------------------------------------------------------------
// Export API Object
// -------------------------------------------------------------

export const notificationApi = {
  create,
  getList,
  markMessages,
  unreadCount,
  update,
};
