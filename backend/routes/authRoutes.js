// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');

// 👉 NUEVA RUTA: Verifica si el usuario tiene sesión activa
router.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    // Devuelve los datos del usuario si está logueado
    res.json({ 
      usuario: { 
        id: req.session.userId, 
        nombre: req.session.nombre 
      } 
    });
  } else {
    // Si no hay sesión, devuelve error 401 (no autorizado)
    res.status(401).json({ error: 'No autenticado' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { nombre, clave } = req.body;
  const usuario = await Usuario.validarClave(nombre, clave);
  
  if (usuario) {
    req.session.userId = usuario.id;
    req.session.nombre = usuario.nombre;
    return res.json({ success: true, nombre: usuario.nombre });
  }
  
  res.status(401).json({ success: false, error: 'Usuario o clave incorrectos' });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

module.exports = router;