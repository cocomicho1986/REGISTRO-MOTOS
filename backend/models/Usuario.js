// models/Usuario.js
// Modelo de Sequelize para la tabla 'tabla_usuario'.
// Define la estructura de los usuarios y métodos seguros para manejar contraseñas.

const { DataTypes } = require('sequelize');        // Tipos de datos para definir campos
const sequelize = require('../config/database');   // Conexión a la base de datos
const bcrypt = require('bcrypt');                  // Librería para hashing seguro de contraseñas

// Define el modelo 'Usuario' que mapea a la tabla 'tabla_usuario' en la base de datos
const Usuario = sequelize.define('tabla_usuario', {
  // Campo 'id': clave primaria autoincremental
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,      // Define como clave primaria
    autoIncrement: true    // Incremento automático (1, 2, 3...)
  },
  
  // Campo 'nombre': texto obligatorio (no puede ser NULL)
  nombre: {
    type: DataTypes.TEXT,
    allowNull: false       // Requerido en la base de datos
  },
  
  // Campo 'email': opcional para compatibilidad con JWT (puede ser null)
  email: {
    type: DataTypes.TEXT,
    allowNull: true,       // Opcional - permite mantener usuarios existentes
    validate: {
      isEmail: true
    }
  },
  
  // Campo 'clave': almacena el hash de la contraseña (¡nunca en texto plano!)
  clave: {
    type: DataTypes.TEXT,
    allowNull: false       // Requerido en la base de datos
  }
}, {
  // Nombre exacto de la tabla en la base de datos (evita que Sequelize use pluralización)
  tableName: 'tabla_usuario',
  
  // Desactiva los campos automáticos 'createdAt' y 'updatedAt'
  // (coherente con la configuración global y con la estructura de tu tabla)
  timestamps: false
});

// --------------------------------------------------------------------------------
// MÉTODOS ESTÁTICOS PERSONALIZADOS (funciones que se llaman en el modelo, no en instancias)
// --------------------------------------------------------------------------------

/**
 * Crea un nuevo usuario con la contraseña hasheada usando bcrypt.
 * @param {string} nombre - Nombre del usuario.
 * @param {string} clavePlana - Contraseña en texto plano (será hasheada antes de guardar).
 * @param {string|null} email - Email opcional del usuario.
 * @returns {Promise<Usuario>} - Instancia del usuario creado.
 */
Usuario.crearConHash = async function(nombre, clavePlana, email = null) {
  // Genera un hash seguro de la contraseña con 10 rondas de sal (valor estándar)
  const hash = await bcrypt.hash(clavePlana, 10);
  
  // Guarda el usuario en la base de datos con el hash, no con la contraseña plana
  return await this.create({ nombre, email, clave: hash });
};

/**
 * Valida las credenciales de un usuario durante el login.
 * @param {string} nombre - Nombre del usuario (o email si se implementa búsqueda por email).
 * @param {string} clavePlana - Contraseña ingresada por el usuario.
 * @returns {Promise<Usuario|null>} - Devuelve el usuario si las credenciales son válidas, null si no.
 */
Usuario.validarClave = async function(nombre, clavePlana) {
  // Busca al usuario por su nombre (mantener compatibilidad)
  const usuario = await this.findOne({ where: { nombre } });
  
  // Si no existe el usuario, devuelve null
  if (!usuario) return null;
  
  // Compara la contraseña ingresada con el hash almacenado
  const esValida = await bcrypt.compare(clavePlana, usuario.clave);
  
  // Si coincide, devuelve el objeto usuario; si no, devuelve null
  return esValida ? usuario : null;
};

// Exporta el modelo para que pueda ser usado en controladores, rutas, etc.
module.exports = Usuario;