// backend/models/Moto.js
// Modelo de Sequelize para la tabla 'tabla_moto'.
// Representa una motocicleta reportada (por ejemplo, robada o registrada).
// Define todos los campos necesarios para identificar y describir una moto.

const { DataTypes } = require('sequelize');      // Tipos de datos para definir los campos de la tabla
const sequelize = require('../config/database'); // Conexión a la base de datos configurada en database.js

// Define el modelo 'Moto' que mapea directamente a la tabla 'tabla_moto' en la base de datos
const Moto = sequelize.define('tabla_moto', {
  // Identificador único autoincremental de la moto
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,      // Es la clave primaria de la tabla
    autoIncrement: true    // Se genera automáticamente (1, 2, 3...)
  },

  // Datos descriptivos de la motocicleta
  cedula: {
    type: DataTypes.STRING(20),
    validate: {
      len: {
        args: [0, 20],
        msg: 'La cédula no puede superar los 20 caracteres'
      }
    }
  },
  dominio: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El dominio es obligatorio'
      },
      len: {
        args: [3, 15],
        msg: 'El dominio debe tener entre 3 y 15 caracteres'
      }
    }
  },
  marca: {
    type: DataTypes.STRING(50),
    validate: {
      len: {
        args: [0, 50],
        msg: 'La marca no puede superar los 50 caracteres'
      }
    }
  },
  modelo: {
    type: DataTypes.STRING(50),
    validate: {
      len: {
        args: [0, 50],
        msg: 'El modelo no puede superar los 50 caracteres'
      }
    }
  },
  tipo: {
    type: DataTypes.STRING(30),
    validate: {
      len: {
        args: [0, 30],
        msg: 'El tipo no puede superar los 30 caracteres'
      }
    }
  },
  uso: {
    type: DataTypes.STRING(20),
    validate: {
      len: {
        args: [0, 20],
        msg: 'El uso no puede superar los 20 caracteres'
      }
    }
  },
  cuadro: {
    type: DataTypes.STRING(50),
    validate: {
      len: {
        args: [0, 50],
        msg: 'El número de cuadro no puede superar los 50 caracteres'
      }
    }
  },
  motor: {
    type: DataTypes.STRING(50),
    validate: {
      len: {
        args: [0, 50],
        msg: 'El número de motor no puede superar los 50 caracteres'
      }
    }
  },
  cilindrada: {
    type: DataTypes.STRING(10),
    validate: {
      len: {
        args: [0, 10],
        msg: 'La cilindrada no puede superar los 10 caracteres'
      }
    }
  },
  vence: {
    type: DataTypes.STRING(20)
  },
  
  // ==========================================
  // NUEVO CAMPO: Imagen de la motocicleta
  // ==========================================
  imagen: {
    type: DataTypes.BLOB('long'), // 'long' permite almacenar imágenes más grandes (ideal para Base64 o binario)
    allowNull: true               // Opcional, para no romper registros existentes que no tengan imagen
  }

}, {
  // Nombre exacto de la tabla en la base de datos
  tableName: 'tabla_moto',

  // Desactiva los campos automáticos 'createdAt' y 'updatedAt'
  timestamps: false
});

// Exporta el modelo para que pueda ser utilizado en controladores, rutas y otros módulos
module.exports = Moto;