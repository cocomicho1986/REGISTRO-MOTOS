import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from "./hooks/useAuth";
import Layout from './components/Layout/Layout'; 
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProfileView from './components/ProfileView';
import MotoListPublica from './components/MotoListPublica';
import MotoListAdmin from './components/MotoListAdmin';
import MotoForm from './components/MotoForm';
import UsuarioListAdmin from './components/UsuarioListAdmin';
import UsuarioForm from './components/UsuarioForm';
import './assets/styles/layout/app.css';

// Ruta pública
function PublicRoute({ children }) {
  return children;
}

// Ruta protegida
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
      {/* ✅ Envolver todas las rutas principales con Layout */}
      <Route element={<Layout />}>
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <MotoListPublica />
            </PublicRoute>
          } 
        />
        
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
        
        <Route 
          path="/admin/usuarios" 
          element={
            <PrivateRoute>
              <UsuarioListAdmin />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/usuarios/nueva" 
          element={
            <PrivateRoute>
              <UsuarioForm />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/usuarios/editar/:id" 
          element={
            <PrivateRoute>
              <UsuarioForm />
            </PrivateRoute>
          } 
        />
        
        {/* Nueva ruta: Perfil del usuario */}
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <ProfileView />
            </PrivateRoute>
          } 
        />
      </Route>
      
      {/* ❌ Login y Registro SIN Layout (sin footer) */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      
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