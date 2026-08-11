export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1';

interface FastAPIErrorDetail {
  msg?: string;
  type?: string;
  loc?: (string | number)[];
}

export function getHeaders(isAuthenticated = false): HeadersInit {
  const headers: Record<string, string> = {};

  if (isAuthenticated) {
    const token = localStorage.getItem('@peel:token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('unauthorized-event'));
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    let message = 'Erro inesperado do servidor';

    if (errorData.detail) {
      if (Array.isArray(errorData.detail)) {
        message = errorData.detail
          .map((item: FastAPIErrorDetail) => {
            if (typeof item?.msg === 'string') {
              return item.msg.replace(/^Value error,\s*/i, '');
            }
            return 'Dado inválido';
          })
          .join(' | ');
      } else if (typeof errorData.detail === 'string') {
        message = errorData.detail;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return true as T;
  }

  const contentLength = response.headers.get('content-length');
  if (contentLength === '0') {
    return {} as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, any> | BodyInit | null;
  auth?: boolean;
}

export async function apiFetch<T>(
  input: RequestInfo | URL,
  init: ApiFetchOptions = {}
): Promise<T> {
  const { auth = false, headers: customHeaders, body, ...customConfig } = init;

  const headers = new Headers(getHeaders(auth));

  if (customHeaders) {
    new Headers(customHeaders).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const isJsonPayload =
    body &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer);

  if (isJsonPayload && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let formattedBody: BodyInit | null = body as BodyInit | null;
  if (body && typeof body === 'object' && isJsonPayload) {
    formattedBody = JSON.stringify(body);
  }

  let targetUrl: RequestInfo | URL = input;
  if (typeof input === 'string' && !input.startsWith('http://') && !input.startsWith('https://')) {
    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanInput = input.startsWith('/') ? input : `/${input}`;
    targetUrl = `${cleanBaseUrl}${cleanInput}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
    body: formattedBody,
  };

  try {
    const response = await fetch(targetUrl, config);
    return await handleResponse<T>(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Não foi possível se conectar ao servidor.');
      }
      throw error;
    }
    throw new Error('Erro desconhecido ao processar a requisição.');
  }
}