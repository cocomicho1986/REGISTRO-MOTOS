import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/components/registerForm.css';

export default function RegisterForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, clave })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('¡Registro exitoso! Redirigiendo al login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.error || 'Error en el registro');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="register-form-container">
      <h2 className="register-form-title">📝 Registrarse</h2>
      {error && <p className="register-error">{error}</p>}
      {success && <p className="register-success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group-register">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="register-input"
            maxLength={50}
          />
        </div>
        <div className="form-group-register">
          <input
            type="email"
            placeholder="Correo electrónico (opcional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
            maxLength={100}
          />
        </div>
        <div className="form-group-register">
          <input
            type="password"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            className="register-input"
            minLength={4}
          />
        </div>
        <button
          type="submit"
          className="register-btn"
        >
          Registrarse
        </button>
      </form>
      <p className="register-login-link">
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </div>
  );
}