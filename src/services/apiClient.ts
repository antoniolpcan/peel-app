const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

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
          .map((item: any) => {
            if (typeof item.msg === 'string') {
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

  return response.json();
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

  const config: RequestInit = {
    ...customConfig,
    headers,
    body: formattedBody,
  };

  try {
    const response = await fetch(input, config);
    return await handleResponse<T>(response);
  } catch (error: any) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Não foi possível se conectar ao servidor.');
    }
    throw error;
  }
}

export { BASE_URL };