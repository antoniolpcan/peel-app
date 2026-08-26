export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const WS_BASE_URL =
  import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1';

interface FastAPIErrorDetail {
  msg?: string;
  type?: string;
  loc?: (string | number)[];
}

type ApiBody =
  | object
  | BodyInit
  | null;

export interface ApiFetchOptions
  extends Omit<RequestInit, 'body'> {
  body?: ApiBody;
  skipUnauthorizedEvent?: boolean;
}

async function parseErrorMessage(
  response: Response
): Promise<string> {
  const errorData = await response
    .json()
    .catch(() => ({}));

  const detail = errorData?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item: FastAPIErrorDetail) => {
        if (typeof item?.msg === 'string') {
          return item.msg.replace(
            /^Value error,\s*/i,
            ''
          );
        }

        return 'Dado inválido';
      })
      .join(' | ');
  }

  if (typeof detail === 'string') {
    return detail;
  }

  return 'Erro inesperado do servidor';
}

export async function handleResponse<T>(
  response: Response,
  skipUnauthorizedEvent = false
): Promise<T> {
  if (
    response.status === 401 &&
    !skipUnauthorizedEvent
  ) {
    window.dispatchEvent(
      new CustomEvent('unauthorized-event')
    );
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export async function apiFetch<T>(
  input: RequestInfo | URL,
  init: ApiFetchOptions = {}
): Promise<T> {
  const {
    headers: customHeaders,
    body,
    skipUnauthorizedEvent = false,
    ...customConfig
  } = init;

  const headers = new Headers(customHeaders);

  const isJsonPayload =
    body != null &&
    typeof body === 'object' &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer);

  if (
    isJsonPayload &&
    !headers.has('Content-Type')
  ) {
    headers.set(
      'Content-Type',
      'application/json'
    );
  }

  let formattedBody: BodyInit | null = null;

  if (body != null) {
    formattedBody = isJsonPayload
      ? JSON.stringify(body)
      : (body as BodyInit);
  }

  let targetUrl: RequestInfo | URL = input;

  if (
    typeof input === 'string' &&
    !input.startsWith('http://') &&
    !input.startsWith('https://')
  ) {
    const cleanBaseUrl = BASE_URL.endsWith('/')
      ? BASE_URL.slice(0, -1)
      : BASE_URL;

    const cleanInput = input.startsWith('/')
      ? input
      : `/${input}`;

    targetUrl = `${cleanBaseUrl}${cleanInput}`;
  }

  try {
    const response = await fetch(targetUrl, {
      ...customConfig,
      headers,
      body: formattedBody,
      credentials: 'include',
    });

    return await handleResponse<T>(
      response,
      skipUnauthorizedEvent
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.message === 'Failed to fetch' ||
        error.name === 'TypeError'
      ) {
        throw new Error(
          'Não foi possível se conectar ao servidor.'
        );
      }

      throw error;
    }

    throw new Error(
      'Erro desconhecido ao processar a requisição.'
    );
  }
}