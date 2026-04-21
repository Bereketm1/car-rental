/**
 * API client — all frontend HTTP calls go through here.
 * In dev, Vite proxy forwards /api/* to the Express backend.
 */

const BASE = '/api';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = body.message || body.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  // Unwrap { success, data } pattern from backend
  if (body && typeof body === 'object' && 'data' in body) {
    return body.data;
  }

  return body;
}

const api = {
  async get(path) {
    const res = await fetch(`${BASE}${path}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async post(path, body) {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async put(path, body) {
    const res = await fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async delete(path) {
    const res = await fetch(`${BASE}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async upload(path, formData) {
    const headers = {};
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type — browser sets multipart boundary automatically
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(res);
  },
};

export default api;
