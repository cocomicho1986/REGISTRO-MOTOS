// frontend/src/hooks/useMotos.js
import { useState, useEffect, useCallback } from 'react'; // ← Añadido useCallback
import api from '../services/api';

export default function useMotos() {
  const [motos, setMotos] = useState([]);
  const [dominio, setDominio] = useState('');
  const [loading, setLoading] = useState(false);

  // 👇 Memoizamos cargarMotos para que tenga identidad estable
  const cargarMotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/motos', { params: { dominio: dominio || undefined } });
      setMotos(res.data.motos || []);
    } catch (err) {
      console.error('Error al cargar motos:', err);
      setMotos([]);
    } finally {
      setLoading(false);
    }
  }, [dominio]); // ← cargarMotos depende de dominio

  const borrarMoto = async (id) => {
    if (window.confirm('¿Borrar esta moto?')) {
      try {
        await api.delete(`/motos/${id}`);
        cargarMotos(); // ← Ahora cargarMotos es estable
        return true;
      } catch  {
        alert('Error al borrar la moto');
        return false;
      }
    }
    return false;
  };

  // 👇 Ahora podemos incluir cargarMotos en las dependencias sin problemas
  useEffect(() => {
    cargarMotos();
  }, [cargarMotos]); // ✅ ESLint feliz

  return {
    motos,
    dominio,
    setDominio,
    loading,
    cargarMotos,
    borrarMoto
  };
}