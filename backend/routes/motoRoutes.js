// backend/routes/motoRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const motoController = require('../controllers/motoController');

// Rutas públicas (solo lectura)
router.get('/', motoController.listarPublica);
router.get('/:id', motoController.obtenerPorId); // ← NUEVA RUTA: obtener moto por ID

// Rutas protegidas
router.post('/', requireAuth, motoController.crear);
router.put('/:id', requireAuth, motoController.actualizar);
router.delete('/:id', requireAuth, motoController.borrar);

module.exports = router;