const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export function getHeaders(isAuthenticated = false): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (isAuthenticated) {
    const token = localStorage.getItem('@peel:token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail 
      ? (typeof errorData.detail === 'string' ? errorData.detail : 'Erro na requisição')
      : 'Erro inesperado do servidor';
    throw new Error(message);
  }

  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('unauthorized-event'));
  }

  if (response.status === 204) {
    return true as T;
  }

  return response.json();
}

export { BASE_URL };