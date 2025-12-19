// frontend/src/components/MotoForm.jsx
import useMotoForm from '../hooks/useMotoForm';
import '../assets/styles/components/motoForm.css';

export default function MotoForm() {
  const {
    moto,
    initialLoading,
    error,
    id,
    handleChange,
    handleSubmit,
    handleCancel
  } = useMotoForm();

  if (error) {
    alert(error);
    return null;
  }

  if (initialLoading && id) {
    return <div className="loading-message">Cargando moto...</div>;
  }

  return (
    <div className="moto-form-container">
      <h2 className="moto-form-title">
        {id ? '✏️ Editar Moto' : '➕ Agregar Moto'}
      </h2>
      
      {error && <p className="form-error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Cédula:</label>
            <input
              name="cedula"
              placeholder="Cédula"
              value={moto.cedula || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Dominio *:</label>
            <input
              name="dominio"
              placeholder="Dominio"
              value={moto.dominio || ''}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Marca:</label>
            <input
              name="marca"
              placeholder="Marca"
              value={moto.marca || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Modelo:</label>
            <input
              name="modelo"
              placeholder="Modelo"
              value={moto.modelo || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Tipo:</label>
            <input
              name="tipo"
              placeholder="Tipo"
              value={moto.tipo || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Uso:</label>
            <input
              name="uso"
              placeholder="Uso"
              value={moto.uso || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Cuadro:</label>
            <input
              name="cuadro"
              placeholder="N° Cuadro"
              value={moto.cuadro || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Motor:</label>
            <input
              name="motor"
              placeholder="N° Motor"
              value={moto.motor || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Cilindrada:</label>
            <input
              name="cilindrada"
              placeholder="Cilindrada"
              value={moto.cilindrada || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Vence:</label>
            <input
              name="vence"
              type="date"
              value={moto.vence || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
          >
            {id ? 'Actualizar' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn-cancel"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}