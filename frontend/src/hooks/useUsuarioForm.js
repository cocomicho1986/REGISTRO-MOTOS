// frontend/src/hooks/useUsuarioForm.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function useUsuarioForm() {
  const [usuario, setUsuario] = useState({ nombre: '', clave: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setInitialLoading(true);
      const cargarUsuario = async () => {
        try {
          const res = await api.get(`/usuarios/${id}`);
          if (res.data) {
            setUsuario({ nombre: res.data.nombre, clave: '' });
          } else {
            setError('Usuario no encontrado');
          }
        } catch (err) {
          console.error('Error al cargar usuario:', err);
          setError('No se pudo cargar el usuario');
        } finally {
          setInitialLoading(false);
        }
      };
      cargarUsuario();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await api.put(`/usuarios/${id}`, usuario);
      } else {
        await api.post('/usuarios', usuario);
      }
      navigate('/admin/usuarios');
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al guardar. Verifica los datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/usuarios');
  };

  return {
    usuario,
    setUsuario,
    loading,
    initialLoading,
    error,
    id,
    handleChange,
    handleSubmit,
    handleCancel
  };
}