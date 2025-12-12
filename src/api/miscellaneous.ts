// miscApi.ts
import { api } from "./api";

// -------------------------------------------------------------
// Types
// -------------------------------------------------------------

export type ApiStatus = {
  type?: string;
  details?: { code?: string; message?: string }[];
};

// -------------------- Check App Update ------------------------

export type CheckAppUpdatePayload = {
  platform: "android" | "ios" | string;
  currentVersion: string;
};

export type AppUpdateInfo = {
  latestVersion?: string;
  forceUpdate?: boolean;
  changelog?: string;
  downloadUrl?: string;
};

export type CheckAppUpdateResponse = {
  status?: ApiStatus;
  updateInfo?: AppUpdateInfo;
};

// -------------------- FAQ -------------------------------------

export type FaqItem = {
  id?: string;
  question?: string;
  answer?: string;
  category?: string;
};

export type FaqResponse = {
  status?: ApiStatus;
  faqList?: FaqItem[];
};

// -------------------- Notifications ----------------------------

export type GetNotificationsPayload = {
  userId?: string;
  limit?: number;
};

export type NotificationItem = {
  id?: string;
  title?: string;
  message?: string;
  createdAt?: string;
};

export type GetNotificationsResponse = {
  status?: ApiStatus;
  notifications?: NotificationItem[];
};

// -------------------- App Versions -----------------------------

export type AppVersionInfo = {
  version?: string;
  platform?: string;
  releaseDate?: string;
  forceUpdate?: boolean;
};

export type GetAppVersionsResponse = {
  status?: ApiStatus;
  versions?: AppVersionInfo[];
};

// -------------------- KVideos (short video list) ---------------

export type GetKVideosPayload = {
  pageNumber?: number;
  pageSize?: number;
};

export type VideoItem = {
  videoId?: string;
  title?: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  createdAt?: string;
};

export type GetKVideosResponse = {
  status?: ApiStatus;
  videoCount?: number;
  videos?: VideoItem[];
};

// -------------------------------------------------------------
// API Calls
// -------------------------------------------------------------

async function checkAppUpdate(payload: CheckAppUpdatePayload) {
  return api.post<CheckAppUpdateResponse>("/misc/v1/checkappupdate", payload);
}

async function getFaq() {
  return api.post<FaqResponse>("/misc/v1/faq", {});
}

async function getAppNotifications(payload: GetNotificationsPayload) {
  return api.post<GetNotificationsResponse>("/misc/v1/getappnotifications", payload);
}

async function getAppVersions() {
  return api.post<GetAppVersionsResponse>("/misc/v1/getappversions", {});
}

async function getKVideos(payload: GetKVideosPayload) {
  return api.post<GetKVideosResponse>("/misc/v1/kvideos", {
    pageNumber: payload.pageNumber ?? 1,
    pageSize: payload.pageSize ?? 20,
  });
}

// -------------------------------------------------------------
// Export API Object
// -------------------------------------------------------------

export const miscApi = {
  checkAppUpdate,
  getFaq,
  getAppNotifications,
  getAppVersions,
  getKVideos,
};
