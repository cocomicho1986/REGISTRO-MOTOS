const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');
const { requireAuth, generateToken } = require('../middleware/jwtAuth');

// 👉 RUTA: Verifica si el usuario tiene sesión activa (sesiones tradicionales)
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

// 👉 RUTA: Registro de nuevos usuarios
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, clave } = req.body;
    
    // Validaciones básicas
    if (!nombre || !clave) {
      return res.status(400).json({ success: false, error: 'Nombre y clave son requeridos' });
    }
    
    if (clave.length < 4) {
      return res.status(400).json({ success: false, error: 'La clave debe tener al menos 4 caracteres' });
    }
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { nombre } });
    if (usuarioExistente) {
      return res.status(400).json({ success: false, error: 'El nombre de usuario ya está en uso' });
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.crearConHash(nombre, clave, email);
    
    res.status(201).json({ 
      success: true, 
      message: 'Usuario creado exitosamente',
      usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email }
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// 👉 RUTA: Login con JWT (reemplaza el login anterior pero mantiene retrocompatibilidad)
router.post('/login', async (req, res) => {
  try {
    const { nombre, clave } = req.body;
    
    if (!nombre || !clave) {
      return res.status(400).json({ success: false, error: 'Nombre y clave son requeridos' });
    }
    
    const usuario = await Usuario.validarClave(nombre, clave);
    
    if (usuario) {
      // Generar token JWT
      const token = generateToken(usuario);
      
      return res.json({ 
        success: true,
        token: token,
        usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
      });
    }
    
    res.status(401).json({ success: false, error: 'Usuario o clave incorrectos' });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// 👉 RUTA: Ver perfil del usuario (requiere JWT)
router.get('/profile', requireAuth, async (req, res) => {
  try {
    // req.user contiene los datos decodificados del token
    res.json({ 
      success: true,
      usuario: { 
        id: req.user.id, 
        nombre: req.user.nombre, 
        email: req.user.email 
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// 👉 RUTA: Actualizar perfil del usuario (requiere JWT)
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const userId = req.user.id;
    
    if (!nombre) {
      return res.status(400).json({ success: false, error: 'El nombre es requerido' });
    }
    
    const usuarioActualizado = await Usuario.actualizarPorId(userId, nombre, email);
    
    // Generar nuevo token con los datos actualizados
    const nuevoToken = generateToken(usuarioActualizado);
    
    res.json({ 
      success: true,
      message: 'Perfil actualizado exitosamente',
      token: nuevoToken,
      usuario: { 
        id: usuarioActualizado.id, 
        nombre: usuarioActualizado.nombre, 
        email: usuarioActualizado.email 
      }
    });
    
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    if (error.message === 'El nombre de usuario ya está en uso') {
      return res.status(400).json({ success: false, error: error.message });
    }
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// 👉 RUTA: Eliminar cuenta del usuario (requiere JWT)
router.delete('/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Usuario.eliminarPorId(userId);
    
    // Limpiar token del frontend
    res.json({ 
      success: true,
      message: 'Cuenta eliminada exitosamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Logout (sesiones tradicionales)
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