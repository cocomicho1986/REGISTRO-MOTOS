import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

// Función de validación reutilizable
const validateField = (fieldName, value) => {
  switch (fieldName) {
    case 'dominio':
      if (!value.trim()) return 'El dominio es obligatorio';
      if (value.length < 3) return 'El dominio debe tener al menos 3 caracteres';
      if (value.length > 15) return 'El dominio no puede superar los 15 caracteres';
      return '';
    case 'cedula':
      if (value.length > 20) return 'La cédula no puede superar los 20 caracteres';
      return '';
    case 'marca':
      if (value.length > 50) return 'La marca no puede superar los 50 caracteres';
      return '';
    case 'modelo':
      if (value.length > 50) return 'El modelo no puede superar los 50 caracteres';
      return '';
    case 'tipo':
      if (value.length > 30) return 'El tipo no puede superar los 30 caracteres';
      return '';
    case 'cuadro':
      if (value.length > 50) return 'El número de cuadro no puede superar los 50 caracteres';
      return '';
    case 'motor':
      if (value.length > 50) return 'El número de motor no puede superar los 50 caracteres';
      return '';
    case 'cilindrada':
      if (value.length > 10) return 'La cilindrada no puede superar los 10 caracteres';
      return '';
    default:
      return '';
  }
};

// Validación de todo el formulario
const validateForm = (moto) => {
  const errors = {};
  Object.keys(moto).forEach(field => {
    const error = validateField(field, moto[field]);
    if (error) errors[field] = error;
  });
  return errors;
};

export default function useMotoForm() {
  const [moto, setMoto] = useState({
    cedula: '',
    dominio: '',
    marca: '',
    modelo: '',
    tipo: '',
    uso: 'Privado',           // ← Valor por defecto
    cuadro: '',
    motor: '',
    cilindrada: '',
    vence: 'SIN VENCIMIENTO'  // ← Valor por defecto
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setInitialLoading(true);
      const cargarMoto = async () => {
        try {
          const res = await api.get(`/motos/${id}`);
          if (res.data) {
            // Asegurar valores por defecto si los campos están vacíos
            const datosConDefaults = {
              ...res.data,
              uso: res.data.uso || 'Privado',
              vence: res.data.vence || 'SIN VENCIMIENTO'
            };
            setMoto(datosConDefaults);
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
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (fieldName, value) => {
    const error = validateField(fieldName, value);
    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar todo el formulario antes de enviar
    const errors = validateForm(moto);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      // Enfocar el primer campo con error
      const firstErrorField = Object.keys(errors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.focus();
      return;
    }

    try {
      if (id) {
        await api.put(`/motos/${id}`, moto);
      } else {
        await api.post('/motos', moto);
      }
      navigate('/admin/motos');
    } catch (err) {
      console.error('Error al guardar moto:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al guardar. Verifica los datos.');
      }
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
    handleCancel,
    formErrors,
    validateField
  };
}