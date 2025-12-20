// frontend/src/hooks/useMotos.js
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export default function useMotos() {
  const [motos, setMotos] = useState([]);
  const [dominio, setDominio] = useState('');
  const [loading, setLoading] = useState(false);

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
  }, [dominio]);

  const borrarMoto = async (id) => {
    if (window.confirm('¿Borrar esta moto?')) {
      try {
        await api.delete(`/motos/${id}`);
        cargarMotos();
        return true;
      } catch {
        alert('Error al borrar la moto');
        return false;
      }
    }
    return false;
  };

  // 🔥 FUNCIÓN CORREGIDA: resetear y recargar inmediatamente
  const resetearTablaMotos = async () => {
    const texto = prompt(
      '⚠️ ¡ATENCIÓN! Se borrarán TODAS las motos.\n' +
      'Escribe "REINICIAR" para confirmar:'
    );
    if (texto === 'REINICIAR') {
      try {
        setLoading(true);
        await api.post('/motos/reset');
        alert('✅ ¡Listo! La tabla está vacía. El próximo ID será 1.');
        setDominio(''); // Limpiar búsqueda
        setTimeout(() => {
          cargarMotos(); // Forzar recarga inmediata
        }, 100);
      } catch {
        alert('❌ Error: no se pudo reiniciar la tabla.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Acción cancelada.');
    }
  };

  useEffect(() => {
    cargarMotos();
  }, [cargarMotos]);

  return {
    motos,
    dominio,
    setDominio,
    loading,
    cargarMotos,
    borrarMoto,
    resetearTablaMotos
  };
}