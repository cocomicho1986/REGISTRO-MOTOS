import useUsuarioForm from '../hooks/useUsuarioForm';
import '../assets/styles/components/usuarioForm.css';

export default function UsuarioForm() {
  const {
    usuario,
    initialLoading,
    error,
    id,
    handleChange,
    handleSubmit,
    handleCancel,
    formErrors,
    validateField
  } = useUsuarioForm();

  if (error && !formErrors.nombre) {
    alert(error);
    return null;
  }

  if (initialLoading && id) {
    return <div className="loading-message-usuario">Cargando usuario...</div>;
  }

  // Función para manejar cambios con validación inmediata
  const handleInputChange = (e) => {
    handleChange(e);
    validateField(e.target.name, e.target.value);
  };

  return (
    <div className="usuario-form-container">
      <h2 className="usuario-form-title">
        {id ? '✏️ Editar Usuario' : '➕ Agregar Usuario'}
      </h2>
      
      {error && !formErrors.nombre && <p className="form-error-usuario">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid-usuario">
          <div className="form-group-usuario">
            <input
              name="nombre"
              placeholder="Nombre *"
              value={usuario.nombre || ''}
              onChange={handleInputChange}
              required
              maxLength={50}
              minLength={2}
              className={`form-input-usuario ${formErrors.nombre ? 'error' : ''}`}
            />
            {formErrors.nombre && <span className="error-message-usuario">{formErrors.nombre}</span>}
          </div>
          
          <div className="form-group-usuario">
            <input
              name="clave"
              type="password"
              placeholder={id ? "Nueva contraseña (opcional)" : "Clave *"}
              value={usuario.clave || ''}
              onChange={handleChange}
              className="form-input-usuario"
            />
            {/* Nota: Validación de contraseña se hace en backend */}
          </div>
          
          {/* Campo email opcional para JWT */}
          <div className="form-group-usuario">
            <input
              name="email"
              type="email"
              placeholder="Email (opcional)"
              value={usuario.email || ''}
              onChange={handleInputChange}
              maxLength={100}
              className={`form-input-usuario ${formErrors.email ? 'error' : ''}`}
            />
            {formErrors.email && <span className="error-message-usuario">{formErrors.email}</span>}
          </div>
        </div>

        <div className="form-actions-usuario">
          <button
            type="submit"
            className="btn-submit-usuario"
          >
            {id ? 'Actualizar' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn-cancel-usuario"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}