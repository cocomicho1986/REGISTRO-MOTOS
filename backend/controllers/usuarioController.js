// backend/controllers/usuarioController.js
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

/**
 * Obtiene la lista de todos los usuarios registrados.
 */
exports.listar = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['clave'] } });
    res.json({ usuarios });
  } catch (error) {
    console.error('Error en listar usuarios:', error);
    res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
  }
};

/**
 * Obtiene un usuario por su ID.
 */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, { attributes: { exclude: ['clave'] } });
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

/**
 * Crea un nuevo usuario administrativo.
 */
exports.crear = async (req, res) => {
  try {
    const { nombre, clave } = req.body;
    
    if (!nombre || !clave) {
      return res.status(400).json({ error: 'Nombre y clave son requeridos' });
    }
    
    const usuario = await Usuario.crearConHash(nombre, clave);
    const { clave: _, ...usuarioSinClave } = usuario.toJSON();
    res.status(201).json(usuarioSinClave);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(400).json({ error: 'Error al crear el usuario' });
  }
};

/**
 * Actualiza los datos de un usuario existente.
 */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, clave } = req.body;
    
    const usuarioExistente = await Usuario.findByPk(id);
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updateData = { nombre };
    if (clave) {
      updateData.clave = await bcrypt.hash(clave, 10);
    }
    
    await Usuario.update(updateData, { where: { id } });
    const usuarioActualizado = await Usuario.findByPk(id, { attributes: { exclude: ['clave'] } });
    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(400).json({ error: 'Error al actualizar el usuario' });
  }
};

/**
 * Elimina un usuario por su ID.
 */
exports.borrar = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id == 1) {
      return res.status(400).json({ error: 'No se puede eliminar el usuario administrador' });
    }
    
    const deleted = await Usuario.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(400).json({ error: 'Error al eliminar el usuario' });
  }
};