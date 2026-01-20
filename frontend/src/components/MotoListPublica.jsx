import { useState, useEffect } from 'react';
import api from '../services/api';
import '../assets/styles/components/motoListPublica.css';

export default function MotoListPublica() {
  const [motos, setMotos] = useState([]);
  const [dominio, setDominio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarMotos = async () => {
      setLoading(true);
      try {
        const res = await api.get('/motos', { params: { dominio: dominio || undefined } });
        setMotos(res.data.motos || []);
      } catch (err) {
        console.error('Error al cargar motos:', err);
        setMotos([]);
      } finally {
        setLoading(false);
      }
    };
    cargarMotos();
  }, [dominio]);

  return (
    <div className="moto-list-publica-container">
      <h2 className="moto-list-publica-title">Motos reclamadas</h2>
      <a href="/login" className="login-link">🔐 Iniciar sesión (modo administrador)</a>
      
      <div className="search-container-publica">
        <input
          type="text"
          placeholder="Buscar por dominio..."
          value={dominio}
          onChange={(e) => setDominio(e.target.value)}
          className="search-input-publica"
        />
        {/*<button
          onClick={() => {}}
          className="btn-buscar-publica"
        >
          Buscar
        </button>*/}
      </div>

      <div className="moto-table-container-publica">
        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Cargando...</p>
        ) : (
          <table className="moto-table-publica">
            <thead>
              <tr>
                <th>Dominio</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {motos.length > 0 ? (
                motos.map(moto => (
                  <tr key={moto.id}>
                    <td>{moto.dominio}</td>
                    <td>{moto.marca}</td>
                    <td>{moto.modelo}</td>
                    <td>{moto.tipo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="table-empty-publica">
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