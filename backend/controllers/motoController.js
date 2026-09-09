// backend/controllers/motoController.js
const { Op } = require('sequelize');
const { Moto } = require('../models');
const sequelize = require('../config/database');

const procesarImagen = (moto) => {
  if (!moto) return null;
  const motoObj = moto.toJSON ? moto.toJSON() : { ...moto };
  
  if (motoObj.imagen) {
    console.log("🔍 DEBUG BACKEND - Tipo de dato de imagen:", typeof motoObj.imagen);
    
    // Caso 1: Ya es un string base64 completo
    if (typeof motoObj.imagen === 'string' && motoObj.imagen.startsWith('data:image')) {
      console.log("✅ CASO 1: Ya es base64 completo. Se envía tal cual.");
      return motoObj;
    }
    
    // Caso 2: Es un objeto Buffer serializado como JSON
    if (typeof motoObj.imagen === 'object' && motoObj.imagen.type === 'Buffer' && Array.isArray(motoObj.imagen.data)) {
      console.log("✅ CASO 2: Es objeto Buffer serializado. Convirtiendo...");
      const buffer = Buffer.from(motoObj.imagen.data);
      const str = buffer.toString('utf8');
      
      // Si el contenido del Buffer ya es un string Base64 válido, lo usamos directamente
      if (str.startsWith('data:image')) {
        console.log("✅ El Buffer contiene un string Base64 válido. Usándolo directamente.");
        motoObj.imagen = str;
      } else {
        motoObj.imagen = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      }
      return motoObj;
    }

    // Caso 3: Es un Buffer nativo de Node.js
    if (Buffer.isBuffer(motoObj.imagen)) {
      console.log("✅ CASO 3: Es Buffer nativo. Convirtiendo...");
      const str = motoObj.imagen.toString('utf8');
      
      // Si el contenido del Buffer ya es un string Base64 válido, lo usamos directamente
      if (str.startsWith('data:image')) {
        console.log("✅ El Buffer contiene un string Base64 válido. Usándolo directamente.");
        motoObj.imagen = str;
      } else {
        motoObj.imagen = `data:image/jpeg;base64,${motoObj.imagen.toString('base64')}`;
      }
      return motoObj;
    }
    
    // Caso 4: Es un string pero sin el prefijo data:image
    if (typeof motoObj.imagen === 'string') {
      console.log("✅ CASO 4: Es string sin prefijo. Agregando prefijo...");
      motoObj.imagen = `data:image/jpeg;base64,${motoObj.imagen}`;
      return motoObj;
    }

    console.log("⚠️ DEBUG BACKEND - Formato NO reconocido. Se envía tal cual:", motoObj.imagen);
  }
  
  return motoObj;
};

exports.listarPublica = async (req, res) => {
  try {
    const { dominio } = req.query;
    const where = dominio ? { dominio: { [Op.like]: `%${dominio}%` } } : {};
    const motos = await Moto.findAll({ where });
    const motosProcesadas = motos.map(procesarImagen);
    res.json({ motos: motosProcesadas });
  } catch (error) {
    console.error('Error en listarPublica:', error);
    res.status(500).json({ error: 'Error al obtener la lista de motos' });
  }
};

exports.listarAdmin = async (req, res) => {
  try {
    const { dominio } = req.query;
    const where = dominio ? { dominio: { [Op.like]: `%${dominio}%` } } : {};
    const motos = await Moto.findAll({ where });
    const motosProcesadas = motos.map(procesarImagen);
    res.json({ motos: motosProcesadas });
  } catch (error) {
    console.error('Error en listarAdmin:', error);
    res.status(500).json({ error: 'Error al obtener la lista de motos' });
  }
};

exports.crear = async (req, res) => {
  try {
    const moto = await Moto.create(req.body);
    res.status(201).json(procesarImagen(moto)); 
  } catch (error) {
    console.error('Error en crear moto:', error);
    res.status(400).json({ error: 'Error al crear la motocicleta' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Moto.update(req.body, { where: { id } });
    if (updated > 0) {
      const motoActualizada = await Moto.findByPk(id);
      res.json(procesarImagen(motoActualizada));
    } else {
      res.status(404).json({ error: 'Moto no encontrada' });
    }
  } catch (error) {
    console.error('Error en actualizar moto:', error);
    res.status(400).json({ error: 'Error al actualizar la motocicleta' });
  }
};

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

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const moto = await Moto.findByPk(id);
    if (moto) {
      res.json(procesarImagen(moto));
    } else {
      res.status(404).json({ error: 'Moto no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener moto por ID:', error);
    res.status(500).json({ error: 'Error al obtener la moto' });
  }
};

exports.resetearTabla = async (req, res) => {
  try {
    await sequelize.query('TRUNCATE TABLE tabla_moto');
    res.json({ message: '✅ Tabla de motos reiniciada. El próximo ID será 1.' });
  } catch (error) {
    console.error('Error al reiniciar tabla:', error.message);
    res.status(500).json({ error: '❌ No se pudo reiniciar la tabla.' });
  }
};