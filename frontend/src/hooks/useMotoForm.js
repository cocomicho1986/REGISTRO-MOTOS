// frontend/src/hooks/useMotoForm.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

// Función de validación reutilizable (Renombrada para evitar conflicto de nombres)
const validateSingleField = (fieldName, value) => {
  switch (fieldName) {
    case 'dominio':
      if (!value || !value.trim()) return 'El dominio es obligatorio';
      if (value.length < 3) return 'El dominio debe tener al menos 3 caracteres';
      if (value.length > 15) return 'El dominio no puede superar los 15 caracteres';
      return '';
    case 'cedula':
      if (value && value.length > 20) return 'La cédula no puede superar los 20 caracteres';
      return '';
    case 'marca':
      if (value && value.length > 50) return 'La marca no puede superar los 50 caracteres';
      return '';
    case 'modelo':
      if (value && value.length > 50) return 'El modelo no puede superar los 50 caracteres';
      return '';
    case 'tipo':
      if (value && value.length > 30) return 'El tipo no puede superar los 30 caracteres';
      return '';
    case 'cuadro':
      if (value && value.length > 50) return 'El número de cuadro no puede superar los 50 caracteres';
      return '';
    case 'motor':
      if (value && value.length > 50) return 'El número de motor no puede superar los 50 caracteres';
      return '';
    case 'cilindrada':
      if (value && value.length > 10) return 'La cilindrada no puede superar los 10 caracteres';
      return '';
    default:
      return '';
  }
};

// Validación de todo el formulario
const validateForm = (moto) => {
  const errors = {};
  Object.keys(moto).forEach(field => {
    // Ignoramos la validación de 'imagen' porque es opcional
    if (field !== 'imagen') {
      const error = validateSingleField(field, moto[field]);
      if (error) errors[field] = error;
    }
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
    vence: 'SIN VENCIMIENTO', // ← Valor por defecto
    imagen: null              // ← NUEVO: Campo para la imagen (Base64)
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
            // Manejo seguro de la imagen: si viene como Buffer desde Sequelize, lo convertimos a Base64 para la vista previa
            let imagenPreview = null;
            if (res.data.imagen) {
              if (typeof res.data.imagen === 'string') {
                imagenPreview = res.data.imagen;
              } else {
                // Si es un objeto/buffer, lo convertimos
                imagenPreview = `data:image/jpeg;base64,${Buffer.from(res.data.imagen).toString('base64')}`;
              }
            }

            const datosConDefaults = {
              ...res.data,
              uso: res.data.uso || 'Privado',
              vence: res.data.vence || 'SIN VENCIMIENTO',
              imagen: imagenPreview
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
    const { name, value, type, files } = e.target;
    
    // Si el campo es un archivo (imagen), lo convertimos a Base64
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setMoto(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      // Comportamiento normal para campos de texto
      setMoto(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar error del campo cuando el usuario empieza a escribir/cambiar
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Función dedicada para validar y establecer el error de un campo específico
  const handleFieldValidation = (fieldName, value) => {
    const error = validateSingleField(fieldName, value);
    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    return error;
  };

  // NUEVO: Función para eliminar la imagen seleccionada o existente
  const handleRemoveImage = () => {
    setMoto(prev => ({ ...prev, imagen: null }));
    // Opcional: resetear el valor del input file en el DOM si se pasa la referencia
    const fileInput = document.querySelector('input[name="imagen"]');
    if (fileInput) fileInput.value = '';
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
    handleRemoveImage, // ← Exportado para usar en el formulario
    handleSubmit,
    handleCancel,
    formErrors,
    handleFieldValidation // ← Exportado con el nombre corregido
  };
}