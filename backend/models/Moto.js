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
  cedula: DataTypes.TEXT,     // Cédula del propietario o responsable
  dominio: DataTypes.TEXT,    // Patente o matrícula de la moto (campo clave para búsqueda)
  marca: DataTypes.TEXT,      // Marca del fabricante (ej: Honda, Yamaha)
  modelo: DataTypes.TEXT,     // Modelo específico (ej: CBR600, R1)
  tipo: DataTypes.TEXT,       // Tipo de motocicleta (ej: Deportiva, Naked, Custom)
  uso: DataTypes.TEXT,        // Uso declarado (ej: Particular, Comercial)
  cuadro: DataTypes.TEXT,     // Número de chasis o cuadro (VIN)
  motor: DataTypes.TEXT,      // Número de serie del motor
  cilindrada: DataTypes.TEXT, // Capacidad del motor en cc (ej: 600, 1000)
  vence: DataTypes.TEXT       // Fecha de vencimiento de registro (almacenada como texto, ej: "2026-12-31")
}, {
  // Nombre exacto de la tabla en la base de datos (evita que Sequelize use su propia convención de nombres)
  tableName: 'tabla_moto',

  // Desactiva los campos automáticos 'createdAt' y 'updatedAt'
  // porque tu tabla no los incluye y no son necesarios para este caso de uso
  timestamps: false
});

// Exporta el modelo para que pueda ser utilizado en controladores, rutas y otros módulos
module.exports = Moto;