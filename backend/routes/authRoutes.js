// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');

// 👉 RUTA: Verifica si el usuario tiene sesión activa
router.get('/', (req, res) => {
  try {
    if (req.session && req.session.userId) {
      // Devuelve los datos del usuario si está logueado
      res.json({ 
        success: true,
        usuario: { 
          id: req.session.userId, 
          nombre: req.session.nombre 
        } 
      });
    } else {
      // Si no hay sesión, devuelve error 401 (no autorizado)
      res.status(401).json({ success: false, error: 'No autenticado' });
    }
  } catch (error) {
    console.error('Error en verificación de sesión:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { nombre, clave } = req.body;
    const usuario = await Usuario.validarClave(nombre, clave);
    
    if (usuario) {
      req.session.userId = usuario.id;
      req.session.nombre = usuario.nombre;
      return res.json({ 
        success: true, 
        usuario: { id: usuario.id, nombre: usuario.nombre }
      });
    }
    
    res.status(401).json({ success: false, error: 'Usuario o clave incorrectos' });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al destruir sesión:', err);
        return res.status(500).json({ success: false, error: 'Error al cerrar sesión' });
      }
      res.json({ success: true });
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

module.exports = router;