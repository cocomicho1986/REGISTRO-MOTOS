// routes/adminRoutes.js
// Define todas las rutas protegidas del panel de administración.
// Estas rutas solo son accesibles para usuarios autenticados (gracias al middleware 'requireAuth').
// Sigue el patrón MVC: las rutas solo definen endpoints y delegan la lógica a controladores.

const express = require('express');
const router = express.Router();                             // Enrutador modular de Express
const { requireAuth } = require('../middleware/auth');       // Middleware para proteger rutas
const motoController = require('../controllers/motoController');     // Controlador de motos
const usuarioController = require('../controllers/usuarioController'); // Controlador de usuarios

// --------------------------------------------------------------------------------
// RUTAS PROTEGIDAS PARA GESTIÓN DE MOTOCICLETAS
// Todas incluyen el middleware 'requireAuth' como segundo argumento.
// Esto asegura que solo usuarios con sesión activa puedan acceder.
// --------------------------------------------------------------------------------

// Lista todas las motos (con buscador por dominio)
router.get('/motos', requireAuth, motoController.listarAdmin);

// Crea una nueva moto (método POST desde formulario)
router.post('/motos/create', requireAuth, motoController.crear);

// Actualiza una moto existente (el ID se pasa en la URL como parámetro)
router.post('/motos/update/:id', requireAuth, motoController.actualizar);

// Elimina una moto (el ID se pasa en la URL como parámetro)
router.get('/motos/delete/:id', requireAuth, motoController.borrar);

// --------------------------------------------------------------------------------
// RUTAS PROTEGIDAS PARA GESTIÓN DE USUARIOS ADMINISTRATIVOS
// Igualmente protegidas por 'requireAuth'.
// Permiten crear, editar y eliminar cuentas de usuario (incluyendo contraseñas seguras).
// --------------------------------------------------------------------------------

// Lista todos los usuarios
router.get('/usuarios', requireAuth, usuarioController.listar);

// Crea un nuevo usuario
router.post('/usuarios/create', requireAuth, usuarioController.crear);

// Actualiza un usuario existente (nombre y/o contraseña)
router.post('/usuarios/update/:id', requireAuth, usuarioController.actualizar);

// Elimina un usuario
router.get('/usuarios/delete/:id', requireAuth, usuarioController.borrar);

// Exporta el enrutador para que pueda ser montado en la aplicación principal (app.js)
module.exports = router;