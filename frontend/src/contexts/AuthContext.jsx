// frontend/src/contexts/AuthContext.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContextInstance';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        // Primero intentar con JWT (más rápido)
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get('/auth/jwt/me');
          setUsuario(res.data.usuario || null);
          return;
        }
        
        // Si no hay token, verificar sesiones tradicionales
        const res = await api.get('/auth');
        setUsuario(res.data.usuario || null);
      } catch (error) {
        if (error.response?.status === 401) {
          // Limpiar token si es inválido
          localStorage.removeItem('token');
          setUsuario(null);
        } else {
          console.warn('Error al verificar autenticación:', error.message);
          setUsuario(null);
        }
      } finally {
        setLoading(false);
      }
    };
    verificarAutenticacion();
  }, []);

  const login = async (nombre, clave, usarJwt = false) => {
    if (usarJwt) {
      // Login con JWT
      const res = await api.post('/auth/jwt/login', { nombre, clave });
      if (res.data.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUsuario(res.data.usuario);
        
        // Actualizar la instancia de axios para usar JWT
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        api.defaults.withCredentials = false;
      }
      return res.data;
    } else {
      // Login con sesiones tradicionales (comportamiento actual)
      const res = await api.post('/auth/login', { nombre, clave });
      if (res.data.success) {
        // Limpiar cualquier token JWT anterior
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        api.defaults.withCredentials = true;
        setUsuario({ id: res.data.usuario?.id, nombre: res.data.nombre });
      }
      return res.data;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Logout JWT: eliminar token del localStorage
        await api.post('/auth/jwt/logout');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } else {
        // Logout sesiones tradicionales
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.warn('Error en logout:', error.message);
    } finally {
      setUsuario(null);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}