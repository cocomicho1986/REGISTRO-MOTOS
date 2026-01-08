// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true // Mantiene compatibilidad con sesiones
});

// Interceptor para agregar token JWT si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Cuando usamos JWT, no necesitamos cookies
    config.withCredentials = false;
  }
  return config;
});

export default api;