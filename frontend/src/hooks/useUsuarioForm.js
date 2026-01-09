import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

// Función de validación reutilizable
const validateField = (fieldName, value) => {
  switch (fieldName) {
    case 'nombre':
      if (!value.trim()) return 'El nombre es obligatorio';
      if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
      if (value.length > 50) return 'El nombre no puede superar los 50 caracteres';
      return '';
    case 'email':
      if (!value.trim()) return '';
      // Validación simple de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Debe ser un email válido';
      if (value.length > 100) return 'El email no puede superar los 100 caracteres';
      return '';
    default:
      return '';
  }
};

// Validación de todo el formulario
const validateForm = (usuario) => {
  const errors = {};
  // Validar nombre siempre
  const nombreError = validateField('nombre', usuario.nombre);
  if (nombreError) errors.nombre = nombreError;
  
  // Validar email si está presente
  if (usuario.email) {
    const emailError = validateField('email', usuario.email);
    if (emailError) errors.email = emailError;
  }
  
  return errors;
};

export default function useUsuarioForm() {
  const [usuario, setUsuario] = useState({ nombre: '', clave: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setInitialLoading(true);
      const cargarUsuario = async () => {
        try {
          const res = await api.get(`/usuarios/${id}`);
          if (res.data) {
            setUsuario({ 
              nombre: res.data.nombre, 
              clave: '',
              email: res.data.email || ''
            });
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
    const errors = validateForm(usuario);
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
        await api.put(`/usuarios/${id}`, usuario);
      } else {
        await api.post('/usuarios', usuario);
      }
      navigate('/admin/usuarios');
    } catch (err) {
      console.error('Error al guardar usuario:', err);
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
    handleCancel,
    formErrors,
    validateField
  };
}