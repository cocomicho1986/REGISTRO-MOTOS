import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/styles/components/navbar.css';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/'; 
  };

  // Solo mostrar navbar si estamos en rutas de admin
  if (!usuario || !location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="navbar">
      <div>
        <h3 className="navbar-brand">Motos reclamadas 👀</h3>
        <div className="navbar-links">
          <button
            onClick={() => navigate('/admin/motos')}
            className={`nav-link ${location.pathname === '/admin/motos' ? 'active' : ''}`}
          >
            Motos
          </button>
          <button
            onClick={() => navigate('/admin/usuarios')}
            className={`nav-link ${location.pathname === '/admin/usuarios' ? 'active' : ''}`}
          >
            Usuarios
          </button>
        </div>
      </div>
      
      <div className="nav-user-info">
{/*
Etapa 9: Visualización en la interfaz de usuario

El componente Navbar.jsx consume el contexto de autenticación mediante useAuth(), obteniendo el objeto usuario del estado global y mostrando "Bienvenido, admin" en la interfaz, completando el ciclo de autenticación visible para el usuario.
Archivo: frontend/src/components/Navbar.jsx -->FIN
*/}      
        <span>Bienvenido, <strong>{usuario.nombre}</strong></span>
        <button
          onClick={handleLogout}
          className="nav-logout-btn"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}