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
          const res = await api.get('/auth/profile');
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

  const login = async (nombre, clave, usarJwt = true) => {
    if (usarJwt) {
      // Login con JWT (ahora por defecto)
{/*
Etapa 2: Procesamiento en el contexto de autenticación

En AuthContext.jsx, la función login recibe los parámetros y envía una solicitud POST a /auth/login 
con las credenciales mediante el cliente HTTP api.js. Si la respuesta es exitosa, guarda el token 
en localStorage, actualiza el estado global y configura axios para futuras solicitudes.
Archivo: frontend/src/contexts/AuthContext.jsx --> Archivo: frontend/src/services/api.js
*/}
      const res = await api.post('/auth/login', { nombre, clave });
      if (res.data.success && res.data.token) {
{/*
Etapa 8: Recepción y actualización del estado en el frontend
El cliente Axios recibe la respuesta como res.data. En AuthContext.jsx, se extrae el token y los datos del usuario, 
se guarda el token en localStorage, se actualiza el estado global con setUsuario() y se configura axios para incluir el
token en futuras solicitudes.
Archivo: frontend/src/contexts/AuthContext.jsx --> Archivo: frontend/src/components/Navbar.jsx
*/}        
        localStorage.setItem('token', res.data.token);
        setUsuario(res.data.usuario);
        
        // Actualizar la instancia de axios para usar JWT
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        api.defaults.withCredentials = false;
      }
      return res.data;
    } else {
      // Login con sesiones tradicionales (mantenido para retrocompatibilidad)
      const res = await api.post('/auth/login-sesion', { nombre, clave });
      if (res.data.success) {
        // Limpiar cualquier token JWT anterior
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        api.defaults.withCredentials = true;
        setUsuario(res.data.usuario);
      }
      return res.data;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Logout JWT: solo eliminar token del localStorage
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