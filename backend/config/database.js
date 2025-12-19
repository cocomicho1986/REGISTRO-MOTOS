// config/database.js
// Archivo de configuración de la conexión a la base de datos usando Sequelize (ORM).
// Define los parámetros para conectarse a MySQL y el comportamiento global de los modelos.

// Cargar el archivo .env correcto según el entorno
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: envFile });

const { Sequelize } = require('sequelize'); // Importa la clase principal de Sequelize

// Crea una instancia de Sequelize con los parámetros de conexión a MySQL
// Esta instancia será reutilizada por todos los modelos para interactuar con la base de datos.
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'bd_motos',    // Nombre de la base de datos
  process.env.MYSQL_USER || 'root',            // Usuario de MySQL
  process.env.MYSQL_PASSWORD || 'congreso22',  // Contraseña del usuario
  {
    host: process.env.MYSQL_HOST || 'localhost', // Dirección del servidor de base de datos
    dialect: 'mysql',  // Tipo de base de datos (MySQL, PostgreSQL, SQLite, etc.)
    
    // Desactiva el logging de las consultas SQL en la consola.
    // Útil en desarrollo si quieres ver las queries; en producción generalmente se deja en false.
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // Configuración global aplicada a todos los modelos definidos con esta instancia.
    define: {
      // Desactiva los campos automáticos 'createdAt' y 'updatedAt'.
      // Tus tablas no los tienen, así que los desactivamos para evitar errores.
      timestamps: false
    }
    // ⚠️ Eliminado: dialectOptions y ssl
    // FreeSQLDatabase NO soporta SSL de forma fiable → conexión sin cifrar
  }
);

// Exporta la instancia de Sequelize para que pueda ser usada en modelos, controladores y otros archivos.
module.exports = sequelize;