// controllers/motoController.js
// Controlador para gestionar todas las operaciones relacionadas con motocicletas.
// Separa la lógica de negocio de las rutas, siguiendo el patrón MVC (Modelo-Vista-Controlador).
// Contiene acciones para vistas públicas y administrativas.
// ⚠️ Actualizado para API REST: devuelve JSON, no renderiza vistas.

const { Op } = require('sequelize');        // Operadores de Sequelize para consultas avanzadas (ej: LIKE)
const { Moto } = require('../models');      // Modelo de datos para interactuar con la tabla 'tabla_moto'

/**
 * Obtiene la lista pública de motos (solo lectura).
 * Incluye un buscador por dominio (búsqueda parcial).
 * 
 * @param {Object} req - Solicitud HTTP (contiene query params como 'dominio').
 * @param {Object} res - Respuesta HTTP (devuelve JSON con la lista de motos).
 */
exports.listarPublica = async (req, res) => {
  try {
    const { dominio } = req.query;
    const where = dominio ? { dominio: { [Op.like]: `%${dominio}%` } } : {};
    const motos = await Moto.findAll({ where });
    res.json({ motos });
  } catch (error) {
    console.error('Error en listarPublica:', error);
    res.status(500).json({ error: 'Error al obtener la lista de motos' });
  }
};

/**
 * Obtiene la lista de motos para el panel de administración.
 * Incluye el mismo buscador por dominio que la vista pública.
 * 
 * @param {Object} req - Solicitud HTTP.
 * @param {Object} res - Respuesta HTTP (devuelve JSON con la lista de motos).
 */
exports.listarAdmin = async (req, res) => {
  try {
    const { dominio } = req.query;
    const where = dominio ? { dominio: { [Op.like]: `%${dominio}%` } } : {};
    const motos = await Moto.findAll({ where });
    res.json({ motos });
  } catch (error) {
    console.error('Error en listarAdmin:', error);
    res.status(500).json({ error: 'Error al obtener la lista de motos' });
  }
};

/**
 * Crea una nueva motocicleta en la base de datos.
 * Usa los datos del cuerpo de la solicitud (req.body).
 * 
 * ⚠️ Nota: En producción, se recomienda validar y sanitizar req.body antes de guardar.
 * 
 * @param {Object} req - Solicitud HTTP (req.body contiene los datos de la moto).
 * @param {Object} res - Respuesta HTTP (devuelve la moto creada o un error).
 */
exports.crear = async (req, res) => {
  try {
    const moto = await Moto.create(req.body);
    res.status(201).json(moto); // 201 = Created
  } catch (error) {
    console.error('Error en crear moto:', error);
    res.status(400).json({ error: 'Error al crear la motocicleta' });
  }
};

/**
 * Actualiza una motocicleta existente por su ID.
 * 
 * @param {Object} req - Solicitud HTTP (req.params.id = ID; req.body = datos actualizados).
 * @param {Object} res - Respuesta HTTP (devuelve la moto actualizada o un error).
 */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Actualiza la moto (en MySQL, update() devuelve el número de filas afectadas)
    const updated = await Moto.update(req.body, { where: { id } });
    
    if (updated > 0) {
      // Obtiene la moto actualizada para devolverla
      const motoActualizada = await Moto.findByPk(id);
      res.json(motoActualizada);
    } else {
      res.status(404).json({ error: 'Moto no encontrada' });
    }
  } catch (error) {
    console.error('Error en actualizar moto:', error);
    res.status(400).json({ error: 'Error al actualizar la motocicleta' });
  }
};

/**
 * Elimina una motocicleta por su ID.
 * 
 * @param {Object} req - Solicitud HTTP (req.params.id contiene el ID a borrar).
 * @param {Object} res - Respuesta HTTP (confirma eliminación o error).
 */
exports.borrar = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Moto.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Moto eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Moto no encontrada' });
    }
  } catch (error) {
    console.error('Error en borrar moto:', error);
    res.status(400).json({ error: 'Error al eliminar la motocicleta' });
  }
};

/**
 * Obtiene una motocicleta por su ID.
 * 
 * @param {Object} req - Solicitud HTTP (req.params.id contiene el ID de la moto).
 * @param {Object} res - Respuesta HTTP (devuelve la moto o un error 404).
 */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const moto = await Moto.findByPk(id);
    if (moto) {
      res.json(moto);
    } else {
      res.status(404).json({ error: 'Moto no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener moto por ID:', error);
    res.status(500).json({ error: 'Error al obtener la moto' });
  }
};