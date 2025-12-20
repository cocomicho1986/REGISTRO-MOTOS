import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import useMotos from '../hooks/useMotos';
import '../assets/styles/components/motoListAdmin.css';

export default function MotoListAdmin() {
  const navigate = useNavigate();
  const { motos, dominio, setDominio, loading, borrarMoto, resetearTablaMotos } = useMotos();

  const handleCrear = () => {
    navigate('/admin/motos/nueva');
  };

  const handleEditar = (id) => {
    navigate(`/admin/motos/editar/${id}`);
  };

  const handleBorrar = async (id) => {
    await borrarMoto(id);
  };

  return (
    <div className="moto-list-container">
      <Navbar />
      
      <div className="moto-list-header">
        <h2 className="moto-list-title">🏍️ Gestión de Motos (Admin)</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={resetearTablaMotos}
            className="btn-reset-peligroso"
          >
            💥 Restaurar tabla
          </button>
          <button
            onClick={handleCrear}
            className="btn-agregar-moto"
          >
            + Agregar Moto
          </button>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por dominio..."
          value={dominio}
          onChange={(e) => setDominio(e.target.value)}
          className="search-input"
        />
        <button
          onClick={() => {}}
          className="btn-buscar"
        >
          Buscar
        </button>
      </div>

      <div className="moto-table-container">
        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Cargando...</p>
        ) : (
          <table className="moto-table">
            <thead>
              <tr>
                <th>Dominio</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Cédula</th>
                <th>Uso</th>
                <th>Vence</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {motos.length > 0 ? (
                motos.map(moto => (
                  <tr key={moto.id}>
                    <td>{moto.dominio || '-'}</td>
                    <td>{moto.marca || '-'}</td>
                    <td>{moto.modelo || '-'}</td>
                    <td>{moto.cedula || '-'}</td>
                    <td>{moto.uso || '-'}</td>
                    <td>{moto.vence || '-'}</td>
                    <td>
                      <button
                        onClick={() => handleEditar(moto.id)}
                        className="btn-accion btn-editar"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleBorrar(moto.id)}
                        className="btn-accion btn-borrar"
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="table-empty">
                    No hay motos registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}