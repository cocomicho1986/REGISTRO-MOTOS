// backend/routes/motoRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const motoController = require('../controllers/motoController');

// Rutas públicas (solo lectura)
router.get('/', motoController.listarPublica);
router.get('/:id', motoController.obtenerPorId);

// Rutas protegidas
router.post('/', requireAuth, motoController.crear);
router.put('/:id', requireAuth, motoController.actualizar);
router.delete('/:id', requireAuth, motoController.borrar);

// 🔥 NUEVA RUTA: Reiniciar tabla (solo admin)
router.post('/reset', requireAuth, motoController.resetearTabla);

module.exports = router;