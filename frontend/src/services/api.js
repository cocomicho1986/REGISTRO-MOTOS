// frontend/src/services/api.js
import axios from 'axios';
{/*
Etapa 3: Configuración y envío de la solicitud HTTP
  
El archivo api.js tiene baseURL: '/api' y un interceptor que verifica si existe un token en localStorage.
Como no hay token inicialmente, envía la solicitud sin autorización a POST 
http://localhost:3001/api/auth/login con las credenciales en el cuerpo JSON.
Archivo: frontend/src/services/api.js --> Archivo: backend/routes/authRoutes.js
*/}

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