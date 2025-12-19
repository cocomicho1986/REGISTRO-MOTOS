// frontend/src/hooks/useMotoForm.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function useMotoForm() {
  const [moto, setMoto] = useState({
    cedula: '',
    dominio: '',
    marca: '',
    modelo: '',
    tipo: '',
    uso: '',
    cuadro: '',
    motor: '',
    cilindrada: '',
    vence: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setInitialLoading(true);
      const cargarMoto = async () => {
        try {
          const res = await api.get(`/motos/${id}`);
          if (res.data) {
            setMoto(res.data);
          } else {
            setError('Moto no encontrada');
          }
        } catch (err) {
          console.error('Error al cargar moto:', err);
          setError('No se pudo cargar la moto');
        } finally {
          setInitialLoading(false);
        }
      };
      cargarMoto();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMoto(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await api.put(`/motos/${id}`, moto);
      } else {
        await api.post('/motos', moto);
      }
      navigate('/admin/motos');
    } catch (err) {
      console.error('Error al guardar moto:', err);
      setError('Error al guardar. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/motos');
  };

  return {
    moto,
    setMoto,
    loading,
    initialLoading,
    error,
    id,
    handleChange,
    handleSubmit,
    handleCancel
  };
}