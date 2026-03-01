import { API_BASE_URL } from '../../config.js';

// Central API base URL — change this one line when deploying to production
const BASE_URL = API_BASE_URL;

// Helper to get the stored JWT token
const getToken = () => localStorage.getItem('adminToken');

// Core request function — wraps fetch with auth headers automatically
const request = async (endpoint, options = {}) => {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const mergedHeaders = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!isFormData) {
    mergedHeaders['Content-Type'] = mergedHeaders['Content-Type'] || 'application/json';
  } else if ('Content-Type' in mergedHeaders) {
    delete mergedHeaders['Content-Type'];
  }

  const config = {
    headers: mergedHeaders,
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // If the server returns 401, the token expired — log the admin out
  if (response.status === 401) {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
    return;
  }

  const data = await response.json();

  // If response is not 2xx, throw so the calling code can catch it
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Convenience methods — mirrors axios.get(), axios.post() etc.
export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),

  post: (endpoint, body) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  put: (endpoint, body) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),

  // For file uploads — no Content-Type header (browser sets it with boundary)
  upload: (endpoint, formData) =>
    request(endpoint, {
      method: 'POST',
      body: formData,
    }),
};

// Auth helpers
export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  },

  isLoggedIn: () => !!getToken(),
};
