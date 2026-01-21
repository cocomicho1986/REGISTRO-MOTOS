import { useState } from 'react';
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import '../assets/styles/components/loginForm.css';

export default function LoginForm() {
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

{/*
Etapa 1: Inicio desde el formulario
  
El usuario ingresa "admin" y "1234" en LoginForm.jsx. Al hacer clic en "Entrar", 
se ejecuta handleSubmit que llama al hook login(nombre, clave) del contexto de autenticación.
Archivo: frontend/src/components/LoginForm.jsx --> Archivo: frontend/src/contexts/AuthContext.jsx
*/}
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(nombre, clave);
      navigate('/admin/motos');
    } catch {
      setError('Usuario o clave incorrectos');
    }
  };

  return (
    <div className="login-form-container">
      <h2 className="login-form-title">Acceso</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group-login">
          <input
            type="text"
            placeholder="Usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <div className="form-group-login">
          <input
            type="password"
            placeholder="Clave"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <button
          type="submit"
          className="login-btn"
        >
          Entrar
        </button>
      </form>
      <p className="login-info">
        Usuario de prueba: <strong>admin / 1234</strong>
      </p>
    </div>
  );
}