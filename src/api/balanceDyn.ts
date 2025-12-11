import { api } from "./api";

export type ApiStatus = {
  type?: string;
  details?: { code?: string; message?: string }[];
};

// ---------- BALANCE TYPES ----------
export type BalanceInfo = {
  userId?: string;
  available?: string;
  reserved?: string;
  total?: string;
  updatedAt?: string;
};

export type BalanceResponse = {
  status?: ApiStatus;
  balance?: BalanceInfo;
};

export type ModifyBalancePayload = {
  amount: number;
};

export type UpdateBalancePayload = {
  amount?: number;
  reserved?: number;
  available?: number;
};

export type CreateBalancePayload = {
  amount: number;
};

// ---------- BALANCE API CALLS ----------

// POST /balances/v1/add
async function addBalance(payload: ModifyBalancePayload) {
  return api.post<BalanceResponse>("/balances/v1/add", payload);
}

// POST /balances/v1/create
async function createBalance(payload: CreateBalancePayload) {
  return api.post<BalanceResponse>("/balances/v1/create", payload);
}

// POST /balances/v1/get
async function getBalance() {
  return api.post<BalanceResponse>("/balances/v1/get", {});
}

// POST /balances/v1/release
async function releaseBalance(payload: ModifyBalancePayload) {
  return api.post<BalanceResponse>("/balances/v1/release", payload);
}

// POST /balances/v1/remove
async function removeBalance() {
  return api.post<BalanceResponse>("/balances/v1/remove", {});
}

// POST /balances/v1/reserve
async function reserveBalance(payload: ModifyBalancePayload) {
  return api.post<BalanceResponse>("/balances/v1/reserve", payload);
}

// POST /balances/v1/reset
async function resetBalance() {
  return api.post<BalanceResponse>("/balances/v1/reset", {});
}

// POST /balances/v1/update
async function updateBalance(payload: UpdateBalancePayload) {
  return api.post<BalanceResponse>("/balances/v1/update", payload);
}

// ---------- EXPORT API OBJECT ----------
export const balanceApi = {
  addBalance,
  createBalance,
  getBalance,
  releaseBalance,
  removeBalance,
  reserveBalance,
  resetBalance,
  updateBalance,
};
