// models/Moto.js
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
    type: DataTypes.STRING(20),     // Cédula del propietario o responsable (DNI máximo 8-9 dígitos + formato)
    validate: {
      len: {
        args: [0, 20],
        msg: 'La cédula no puede superar los 20 caracteres'
      }
    }
  },
  dominio: {
    type: DataTypes.STRING(15),    // Patente o matrícula de la moto (campo clave para búsqueda)
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
    type: DataTypes.STRING(50),      // Marca del fabricante (ej: Honda, Yamaha)
    validate: {
      len: {
        args: [0, 50],
        msg: 'La marca no puede superar los 50 caracteres'
      }
    }
  },
  modelo: {
    type: DataTypes.STRING(50),     // Modelo específico (ej: CBR600, R1)
    validate: {
      len: {
        args: [0, 50],
        msg: 'El modelo no puede superar los 50 caracteres'
      }
    }
  },
  tipo: {
    type: DataTypes.STRING(30),       // Tipo de motocicleta (ej: Deportiva, Naked, Custom)
    validate: {
      len: {
        args: [0, 30],
        msg: 'El tipo no puede superar los 30 caracteres'
      }
    }
  },
  uso: {
    type: DataTypes.STRING(20),        // Uso declarado (ej: Particular, Comercial)
    validate: {
      len: {
        args: [0, 20],
        msg: 'El uso no puede superar los 20 caracteres'
      }
    }
  },
  cuadro: {
    type: DataTypes.STRING(50),     // Número de chasis o cuadro (VIN - máximo 17 caracteres estándar)
    validate: {
      len: {
        args: [0, 50],
        msg: 'El número de cuadro no puede superar los 50 caracteres'
      }
    }
  },
  motor: {
    type: DataTypes.STRING(50),      // Número de serie del motor
    validate: {
      len: {
        args: [0, 50],
        msg: 'El número de motor no puede superar los 50 caracteres'
      }
    }
  },
  cilindrada: {
    type: DataTypes.STRING(10), // Capacidad del motor en cc (ej: 600, 1000)
    validate: {
      len: {
        args: [0, 10],
        msg: 'La cilindrada no puede superar los 10 caracteres'
      }
    }
  },
  vence: {
    type: DataTypes.STRING(20)       // Fecha de vencimiento de registro (almacenada como texto, ej: "2026-12-31")
  }
}, {
  // Nombre exacto de la tabla en la base de datos (evita que Sequelize use su propia convención de nombres)
  tableName: 'tabla_moto',

  // Desactiva los campos automáticos 'createdAt' y 'updatedAt'
  // porque tu tabla no los incluye y no son necesarios para este caso de uso
  timestamps: false
});

// Exporta el modelo para que pueda ser utilizado en controladores, rutas y otros módulos
module.exports = Moto;