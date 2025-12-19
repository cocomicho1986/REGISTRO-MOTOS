// frontend/src/components/UsuarioForm.jsx
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
    handleCancel
  } = useUsuarioForm();

  if (error) {
    alert(error);
    return null;
  }

  if (initialLoading && id) {
    return <div className="loading-message-usuario">Cargando usuario...</div>;
  }

  return (
    <div className="usuario-form-container">
      <h2 className="usuario-form-title">
        {id ? '✏️ Editar Usuario' : '➕ Agregar Usuario'}
      </h2>
      
      {error && <p className="form-error-usuario">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid-usuario">
          <div className="form-group-usuario">
            <input
              name="nombre"
              placeholder="Nombre *"
              value={usuario.nombre || ''}
              onChange={handleChange}
              required
              className="form-input-usuario"
            />
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