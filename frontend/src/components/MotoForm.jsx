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
    handleCancel,
    formErrors,
    validateField
  } = useMotoForm();

  if (error && !formErrors.dominio) {
    alert(error);
    return null;
  }

  if (initialLoading && id) {
    return <div className="loading-message">Cargando moto...</div>;
  }

  // Función para manejar cambios con validación inmediata
  const handleInputChange = (e) => {
    handleChange(e);
    validateField(e.target.name, e.target.value);
  };

  return (
    <div className="moto-form-container">
      <h2 className="moto-form-title">
        {id ? '✏️ Editar Moto' : '➕ Agregar Moto'}
      </h2>
      
      {error && !formErrors.dominio && <p className="form-error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Cédula:</label>
            <input
              name="cedula"
              placeholder="Cédula"
              value={moto.cedula || ''}
              onChange={handleInputChange}
              maxLength={20}
              className={`form-input ${formErrors.cedula ? 'error' : ''}`}
            />
            {formErrors.cedula && <span className="error-message">{formErrors.cedula}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Dominio *:</label>
            <input
              name="dominio"
              placeholder="Dominio"
              value={moto.dominio || ''}
              onChange={handleInputChange}
              required
              maxLength={15}
              minLength={3}
              className={`form-input ${formErrors.dominio ? 'error' : ''}`}
            />
            {formErrors.dominio && <span className="error-message">{formErrors.dominio}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Marca:</label>
            <input
              name="marca"
              placeholder="Marca"
              value={moto.marca || ''}
              onChange={handleInputChange}
              maxLength={50}
              className={`form-input ${formErrors.marca ? 'error' : ''}`}
            />
            {formErrors.marca && <span className="error-message">{formErrors.marca}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Modelo:</label>
            <input
              name="modelo"
              placeholder="Modelo"
              value={moto.modelo || ''}
              onChange={handleInputChange}
              maxLength={50}
              className={`form-input ${formErrors.modelo ? 'error' : ''}`}
            />
            {formErrors.modelo && <span className="error-message">{formErrors.modelo}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Tipo:</label>
            <input
              name="tipo"
              placeholder="Tipo"
              value={moto.tipo || ''}
              onChange={handleInputChange}
              maxLength={30}
              className={`form-input ${formErrors.tipo ? 'error' : ''}`}
            />
            {formErrors.tipo && <span className="error-message">{formErrors.tipo}</span>}
          </div>
          
          {/* ✅ CAMPO USO: ahora es un select */}
          <div className="form-group">
            <label className="form-label">Uso:</label>
            <select
              name="uso"
              value={moto.uso}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Privado">Privado</option>
              <option value="Oficial">Oficial</option>
              <option value="Publico">Público</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Cuadro:</label>
            <input
              name="cuadro"
              placeholder="N° Cuadro"
              value={moto.cuadro || ''}
              onChange={handleInputChange}
              maxLength={50}
              className={`form-input ${formErrors.cuadro ? 'error' : ''}`}
            />
            {formErrors.cuadro && <span className="error-message">{formErrors.cuadro}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Motor:</label>
            <input
              name="motor"
              placeholder="N° Motor"
              value={moto.motor || ''}
              onChange={handleInputChange}
              maxLength={50}
              className={`form-input ${formErrors.motor ? 'error' : ''}`}
            />
            {formErrors.motor && <span className="error-message">{formErrors.motor}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Cilindrada:</label>
            <input
              name="cilindrada"
              placeholder="Cilindrada"
              value={moto.cilindrada || ''}
              onChange={handleInputChange}
              maxLength={10}
              className={`form-input ${formErrors.cilindrada ? 'error' : ''}`}
            />
            {formErrors.cilindrada && <span className="error-message">{formErrors.cilindrada}</span>}
          </div>
          
          {/* ✅ CAMPO VENCE: manejo especial para "SIN VENCIMIENTO" */}
          <div className="form-group">
            <label className="form-label">Vence:</label>
            <input
              name="vence"
              type="date"
              value={moto.vence === 'SIN VENCIMIENTO' ? '' : moto.vence}
              onChange={(e) => {
                const valor = e.target.value || 'SIN VENCIMIENTO';
                handleChange({ target: { name: 'vence', value: valor } });
              }}
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