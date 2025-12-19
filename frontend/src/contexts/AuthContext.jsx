// frontend/src/contexts/AuthContext.jsx
import { createContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await api.get('/auth');
        setUsuario(res.data.usuario);
      } catch {
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };
    verificarSesion();
  }, []);

  const login = async (nombre, clave) => {
    const res = await api.post('/auth/login', { nombre, clave });
    setUsuario(res.data);
    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Solo exportamos el componente (para Fast Refresh)
export { AuthContext };