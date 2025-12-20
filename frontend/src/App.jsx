// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from "./hooks/useAuth";
import LoginForm from './components/LoginForm';
import MotoListPublica from './components/MotoListPublica';
import MotoListAdmin from './components/MotoListAdmin';
import MotoForm from './components/MotoForm';
import UsuarioListAdmin from './components/UsuarioListAdmin'; // ← NUEVO
import UsuarioForm from './components/UsuarioForm';         // ← NUEVO

// Ruta pública: accesible sin login
function PublicRoute({ children }) {
  return children;
}

// Ruta protegida: solo para usuarios autenticados
function PrivateRoute({ children }) {
  const { usuario, loading } = useAuth();
  
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando...</div>;
  }
  
  if (!usuario) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function AppContent() {
  return (
    <Routes>
      {/* Ruta pública principal */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <MotoListPublica />
          </PublicRoute>
        } 
      />
      
      {/* Login */}
      <Route path="/login" element={<LoginForm />} />
      
      {/* Rutas protegidas para motos */}
      <Route 
        path="/admin/motos" 
        element={
          <PrivateRoute>
            <MotoListAdmin />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/motos/nueva" 
        element={
          <PrivateRoute>
            <MotoForm />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/motos/editar/:id" 
        element={
          <PrivateRoute>
            <MotoForm />
          </PrivateRoute>
        } 
      />
      
      {/* Rutas protegidas para usuarios */}
      <Route 
        path="/admin/usuarios" 
        element={
          <PrivateRoute>
            <UsuarioListAdmin /> {/* ← REEMPLAZADO */}
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/usuarios/nueva" 
        element={
          <PrivateRoute>
            <UsuarioForm /> {/* ← NUEVA RUTA */}
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/usuarios/editar/:id" 
        element={
          <PrivateRoute>
            <UsuarioForm /> {/* ← NUEVA RUTA */}
          </PrivateRoute>
        } 
      />
      
      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;