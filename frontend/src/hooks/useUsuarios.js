// frontend/src/hooks/useUsuarios.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data.usuarios || []);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const borrarUsuario = async (id, nombre) => {
    if (nombre === 'admin') {
      alert('No se puede eliminar el usuario administrador');
      return false;
    }
    
    if (window.confirm(`¿Borrar usuario "${nombre}"?`)) {
      try {
        await api.delete(`/usuarios/${id}`);
        cargarUsuarios();
        return true;
      } catch {
        alert('Error al borrar el usuario');
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return {
    usuarios,
    loading,
    cargarUsuarios,
    borrarUsuario
  };
}