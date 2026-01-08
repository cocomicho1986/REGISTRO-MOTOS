// backend/middleware/jwtAuth.js
const jwt = require('jsonwebtoken');

// Usa la variable de entorno JWT_SECRET, o un valor por defecto en desarrollo
const JWT_SECRET = process.env.JWT_SECRET || 'registro-motos-jwt-secreto-desarrollo-12345';

/**
 * Middleware para proteger rutas privadas con JWT
 * Verifica el token en el header Authorization: Bearer <token>
 */
const requireAuth = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authRowHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer "
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, nombre, email }
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Error de autenticación' });
  }
};

/**
 * Función para generar un token JWT
 * @param {Object} usuario - Objeto con id, nombre, email del usuario
 * @returns {string} Token JWT firmado
 */
const generateToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id, 
      nombre: usuario.nombre, 
      email: usuario.email 
    },
    JWT_SECRET,
    { expiresIn: '24h' } // Token válido por 24 horas
  );
};

module.exports = { requireAuth, generateToken };