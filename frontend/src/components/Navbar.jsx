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