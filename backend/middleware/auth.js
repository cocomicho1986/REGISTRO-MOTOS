// middleware/auth.js
// Middleware de autenticación para proteger rutas administrativas.
// Verifica si un usuario ha iniciado sesión antes de permitir el acceso a una ruta.

/**
 * Middleware que protege rutas restringidas (como el panel de administración).
 * 
 * Funcionamiento:
 * - Revisa si existe una sesión activa (`req.session`) y si contiene un `userId`.
 * - Si el usuario está autenticado, permite continuar a la ruta solicitada (`next()`).
 * - Si NO está autenticado, redirige al formulario de login.
 * 
 * Este middleware se usa en rutas que requieren permisos de administrador,
 * como la gestión de motos o usuarios.
 * 
 * @param {Object} req - Objeto de solicitud HTTP (contiene la sesión del usuario).
 * @param {Object} res - Objeto de respuesta HTTP (usado para redirigir).
 * @param {Function} next - Función para pasar al siguiente middleware o controlador.
 */
function requireAuth(req, res, next) {
  // Verifica que exista una sesión y que el usuario haya iniciado sesión (tiene userId)
  if (req.session && req.session.userId) {
    return next(); // El usuario está autenticado → permite el acceso
  }
  
  // Si no hay sesión activa, redirige al login
  res.redirect('/login');
}

// Exporta el middleware para que pueda ser usado en las rutas protegidas
module.exports = { requireAuth };