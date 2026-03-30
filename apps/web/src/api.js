function resolveDefaultApiBase() {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000/api';
  }

  return `${window.location.protocol}//${window.location.hostname}:3000/api`;
}

function normalizeApiBase(url) {
  return String(url || resolveDefaultApiBase()).replace(/\/+$/, '');
}

export const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);
export const API_ORIGIN = API_BASE.replace(/\/api$/, '');

async function request(method, path, body, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = localStorage.getItem('token');

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const requestOptions = {
    method,
    headers,
    ...options,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    requestOptions.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    requestOptions.body = body;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? 10000);
  requestOptions.signal = controller.signal;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, requestOptions);
  } catch (error) {
    window.dispatchEvent(new CustomEvent('api-error', { detail: 'Service unreachable' }));
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Check that the gateway and services are running.');
    }
    throw new Error(error.message || 'Network error occurred');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    const errorPayload = await response.json().catch(() => ({ message: response.statusText }));
    const message = Array.isArray(errorPayload.message)
      ? errorPayload.message[0]
      : errorPayload.message || 'Request failed';

    throw new Error(message);
  }

  if (response.status === 204) return null;

  const payload = await response.json();
  if (payload && typeof payload === 'object' && 'data' in payload && 'success' in payload) {
    return payload.data;
  }
  return payload;
}

const api = {
  get: (path, options) => request('GET', path, undefined, options),
  post: (path, body, options) => request('POST', path, body, options),
  put: (path, body, options) => request('PUT', path, body, options),
  delete: (path, options) => request('DELETE', path, undefined, options),
  upload: (path, formData, options) => request('POST', path, formData, options),
};

export default api;
