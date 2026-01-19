const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/jwtAuth'); // ← Cambiado a jwtAuth
const usuarioController = require('../controllers/usuarioController');

// Listar todos los usuarios
router.get('/', requireAuth, usuarioController.listar);

// Obtener un usuario por ID (para edición)
router.get('/:id', requireAuth, usuarioController.obtenerPorId);

// Crear usuario
router.post('/', requireAuth, usuarioController.crear);

// Actualizar usuario
router.put('/:id', requireAuth, usuarioController.actualizar);

// Eliminar usuario
router.delete('/:id', requireAuth, usuarioController.borrar);

module.exports = router;