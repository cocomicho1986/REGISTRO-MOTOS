// frontend/src/components/UsuarioListAdmin.jsx
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import useUsuarios from '../hooks/useUsuarios';
import '../assets/styles/components/usuarioListAdmin.css';

export default function UsuarioListAdmin() {
  const navigate = useNavigate();
  const { usuarios, loading, borrarUsuario } = useUsuarios();

  const handleCrear = () => {
    navigate('/admin/usuarios/nueva');
  };

  const handleEditar = (id) => {
    navigate(`/admin/usuarios/editar/${id}`);
  };

  const handleBorrar = async (id, nombre) => {
    await borrarUsuario(id, nombre);
  };

  return (
    <div className="usuario-list-container">
      <Navbar />
      
      <div className="usuario-list-header">
        <h2 className="usuario-list-title">👥 Gestión de Usuarios</h2>
        <button
          onClick={handleCrear}
          className="btn-agregar-usuario"
        >
          + Agregar Usuario
        </button>
      </div>

      <div className="usuario-table-container">
        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Cargando...</p>
        ) : (
          <div className="usuario-table-wrapper">
            <table className="usuario-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map(usuario => (
                    <tr key={usuario.id}>
                      <td data-label="ID">{usuario.id}</td>
                      <td data-label="Nombre">{usuario.nombre}</td>
                      <td data-label="Email">{usuario.email || '—'}</td>
                      <td data-label="Acciones">
                        <button
                          onClick={() => handleEditar(usuario.id)}
                          className="btn-accion-usuario btn-editar-usuario"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleBorrar(usuario.id, usuario.nombre)}
                          className="btn-accion-usuario btn-borrar-usuario"
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="table-empty-usuario">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}