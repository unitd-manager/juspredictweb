const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string) ??
  (import.meta.env.DEV ? "/api" : "https://test-api.predictyourgame.com/swagger-ui/");

type JsonBody = Record<string, unknown> | Array<unknown> | undefined;

function buildHeaders(extra?: HeadersInit): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(extra || {}),
  };
  const token = localStorage.getItem("auth_token");
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: buildHeaders(init.headers),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown network error";
    throw new Error(`Network error while contacting API: ${msg}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let errorData: any = {};
    try {
      errorData = JSON.parse(text);
    } catch {
      errorData = { message: text };
    }
    
    const error = new Error(errorData.message || errorData.status?.details?.[0]?.message || `API ${res.status} ${res.statusText}`);
    (error as any).response = errorData;
    (error as any).code = errorData.code || errorData.status?.details?.[0]?.code;
    (error as any).status = errorData.status;
    throw error;
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

async function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: "GET" });
}

async function post<T>(path: string, body?: JsonBody): Promise<T> {
  const isJson = body !== undefined;
  return request<T>(path, {
    method: "POST",
    headers: {
      ...(isJson ? { "Content-Type": "application/json" } : {}),
    },
    body: isJson ? JSON.stringify(body) : undefined,
  });
}

async function put<T>(path: string, body?: JsonBody): Promise<T> {
  const isJson = body !== undefined;
  return request<T>(path, {
    method: "PUT",
    headers: {
      ...(isJson ? { "Content-Type": "application/json" } : {}),
    },
    body: isJson ? JSON.stringify(body) : undefined,
  });
}

async function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}

export const api = { request, get, post, put, del };
export const swaggerUrl = "https://api.predictyourgame.com/swagger-ui/";
export const apiBase = API_BASE;