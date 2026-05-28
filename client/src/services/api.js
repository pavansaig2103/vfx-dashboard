import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export const apiClient = axios.create({ baseURL: API_BASE });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cinetrack_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const api = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }).then(r => r.data),
  me: () => apiClient.get('/auth/me').then(r => r.data),
  dashboard: () => apiClient.get('/stats/dashboard').then(r => r.data),
  artists: () => apiClient.get('/stats/artists').then(r => r.data),
  calendar: () => apiClient.get('/stats/calendar').then(r => r.data),
  shots: (params = {}) => apiClient.get('/shots', { params }).then(r => r.data.shots),
  shot: (id) => apiClient.get(`/shots/${id}`).then(r => r.data),
  createShot: (payload) => apiClient.post('/shots', payload).then(r => r.data.shot),
  updateShot: (id, payload) => apiClient.put(`/shots/${id}`, payload).then(r => r.data.shot),
  deleteShot: (id) => apiClient.delete(`/shots/${id}`).then(r => r.data),
  feedback: (id) => apiClient.get(`/shots/${id}/feedback`).then(r => r.data.feedback),
  addFeedback: (id, payload) => apiClient.post(`/shots/${id}/feedback`, payload).then(r => r.data.feedback),
};
