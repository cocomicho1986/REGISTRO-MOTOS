import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import '../assets/styles/components/profileView.css';

export default function ProfileView() {
  const { usuario, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const response = await api.get('/auth/profile');
        if (response.data.success) {
          setPerfil(response.data.usuario);
          setFormData({
            nombre: response.data.usuario.nombre,
            email: response.data.usuario.email || ''
          });
        }
      } catch (err) {
        setError('No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
    
    cargarPerfil();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    if (perfil) {
      setFormData({
        nombre: perfil.nombre,
        email: perfil.email || ''
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/auth/profile', formData);
      if (response.data.success) {
        setPerfil(response.data.usuario);
        setEditMode(false);
        // Actualizar el token en localStorage y en axios
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
    } catch (err) {
      setError('Error al actualizar el perfil');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await api.delete('/auth/profile');
      // Cerrar sesión y redirigir
      await logout();
      window.location.href = '/';
    } catch (err) {
      setError('Error al eliminar la cuenta');
      setIsDeleting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="profile-loading">Cargando...</div>;
  if (error) return <div className="profile-error">{error}</div>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">👤 Mi Perfil</h2>
      
      {editMode ? (
        <div className="profile-edit-form">
          <div className="form-group-profile">
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="profile-input"
              maxLength={50}
            />
          </div>
          <div className="form-group-profile">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="profile-input"
              maxLength={100}
            />
          </div>
          <div className="profile-edit-buttons">
            <button onClick={handleSave} className="profile-save-btn" disabled={isDeleting}>
              Guardar
            </button>
            <button onClick={handleCancel} className="profile-cancel-btn" disabled={isDeleting}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-info">
          <p><strong>Nombre:</strong> {perfil?.nombre}</p>
          <p><strong>Email:</strong> {perfil?.email || 'No proporcionado'}</p>
          <p><strong>ID:</strong> {perfil?.id}</p>
          <div className="profile-action-buttons">
            <button onClick={handleEdit} className="profile-edit-btn">
              Editar Perfil
            </button>
            <button 
              onClick={handleDelete} 
              className="profile-delete-btn"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Cuenta'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}