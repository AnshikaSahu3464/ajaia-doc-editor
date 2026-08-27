import axios from 'axios';

// Vite environments strictly use import.meta.env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({ 
  baseURL: BASE_URL 
});

export const getUsers = () => api.get('/users');
export const getDocuments = () => api.get('/documents');
export const createDocument = (data) => api.post('/documents', data);
export const getDocumentById = (id) => api.get(`/documents/${id}`);
export const updateDocument = (id, data) => api.put(`/documents/${id}`, data);
export const shareDocument = (id, userId) => api.post(`/documents/${id}/share`, { user_id: userId });

export default api;