// initDB.js
const mysql = require('mysql2/promise');

async function initDB() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'congreso22'
  });

  // Crear base de datos si no existe
  await connection.execute(`CREATE DATABASE IF NOT EXISTS bd_motos`);
  await connection.end();

  // Sincronizar modelos (tablas)
  const { Usuario } = require('./models');

  // Esperar a que Sequelize termine la sincronización
  await Usuario.sequelize?.sync({ force: false });

  // Crear usuario de prueba si no existe
  await Usuario.findOrCreate({
    where: { nombre: 'admin' },
    defaults: { clave: '1234' }
  });

  console.log('✅ Base de datos, tablas y usuario de prueba listos');
}

initDB().catch(console.error);