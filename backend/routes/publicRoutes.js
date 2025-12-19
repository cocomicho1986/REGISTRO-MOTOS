// routes/publicRoutes.js
// Define las rutas accesibles públicamente (sin necesidad de autenticación).
// Incluye la vista principal de motos (solo lectura) y las rutas de autenticación (login/logout).
// Sigue el principio de separación de responsabilidades: delega la lógica de negocio a controladores.

const express = require('express');
const router = express.Router();                 // Crea un enrutador modular de Express
const { Usuario } = require('../models');        // Modelo de usuario para validación de login
const motoController = require('../controllers/motoController'); // Controlador para operaciones de motos

// --------------------------------------------------------------------------------
// RUTA PÚBLICA PRINCIPAL: Lista de motos (solo lectura)
// --------------------------------------------------------------------------------
// Delega completamente la lógica al controlador para mantener las rutas limpias.
// El controlador se encarga de la búsqueda, consulta a la BD y renderizado de la vista.
router.get('/', motoController.listarPublica);

// --------------------------------------------------------------------------------
// RUTAS DE AUTENTICACIÓN
// Aunque son breves, se mantienen aquí porque:
// - Son específicas de sesión (no encajan en un controlador genérico de usuarios).
// - Son muy cortas y no justifican un controlador aparte.
// - Centralizan la lógica de inicio/cierre de sesión en un solo lugar.
// --------------------------------------------------------------------------------

/**
 * Muestra el formulario de inicio de sesión.
 * No requiere autenticación (es la puerta de entrada al sistema).
 */
router.get('/login', (req, res) => {
  // Renderiza la vista de login sin errores iniciales
  res.render('login', { error: null });
});

/**
 * Procesa el envío del formulario de login.
 * Valida las credenciales usando el método seguro del modelo Usuario.
 */
router.post('/login', async (req, res) => {
  const { nombre, clave } = req.body;
  
  // Valida la contraseña usando bcrypt (nunca compara texto plano)
  const usuario = await Usuario.validarClave(nombre, clave);

  if (usuario) {
    // Si las credenciales son válidas, inicia sesión almacenando datos en la sesión
    req.session.userId = usuario.id;
    req.session.nombre = usuario.nombre;
    
    // Redirige al panel administrativo
    return res.redirect('/admin/motos');
  }
  
  // Si falla, vuelve al login con mensaje de error
  res.render('login', { error: 'Usuario o clave incorrectos' });
});

/**
 * Cierra la sesión del usuario y lo redirige a la página principal.
 * Usa session.destroy() para eliminar completamente los datos de sesión.
 */
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    // Después de destruir la sesión, redirige a la vista pública
    res.redirect('/');
  });
});

// Exporta el enrutador para que pueda ser montado en app.js
module.exports = router;