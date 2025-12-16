type ApiErrorPayload = {
  message?: string;
};

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export function getApiBaseUrl() {
  return (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
}

function getAuthToken() {
  return localStorage.getItem('admin_token');
}

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    ...(headers || {}),
  };

  const token = getAuthToken();
  if (auth && token) {
    (finalHeaders as any).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (!res.ok) {
    const payload = await parseJsonSafe(res);
    const maybeMsg = (payload as ApiErrorPayload | undefined)?.message;
    throw new ApiError(maybeMsg || `Request failed (${res.status})`, res.status, payload);
  }

  return (await parseJsonSafe(res)) as T;
}

export async function apiJson<T>(
  path: string,
  data: unknown,
  options: Omit<RequestInit, 'body' | 'method' | 'headers'> & { auth?: boolean } = {}
): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',   
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
}

export async function apiPutJson<T>(
  path: string,
  data: unknown,
  options: Omit<RequestInit, 'body' | 'method' | 'headers'> & { auth?: boolean } = {}
): Promise<T> {
  return apiRequest<T>(path, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  options: Omit<RequestInit, 'body' | 'method'> & { method?: 'POST' | 'PUT'; auth?: boolean } = {}
): Promise<T> {
  const { method = 'POST', ...rest } = options;
  return apiRequest<T>(path, {
    method,
    body: formData,
    ...rest,
  });
}
