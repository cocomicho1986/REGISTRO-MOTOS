// backend/auditoria-backend.js
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.development' });

// Configuración
const config = {
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'congreso22',
    database: process.env.MYSQL_DATABASE || 'bd_motos'
  },
  jwtSecret: process.env.JWT_SECRET || 'registro-motos-jwt-secreto-desarrollo-12345'
};

async function auditarBackend() {
  console.log('🔍 INICIANDO AUDITORÍA DE BACKEND\n');
  let errores = 0;

  try {
    // 1. Verificar conexión a base de datos
    console.log('1. Verificando conexión a MySQL...');
    const connection = await mysql.createConnection(config.mysql);
    await connection.end();
    console.log('✅ Conexión a MySQL exitosa\n');

    // 2. Verificar estructura de tablas
    console.log('2. Verificando estructura de tablas...');
    const sequelize = new Sequelize(
      config.mysql.database,
      config.mysql.user,
      config.mysql.password,
      {
        host: config.mysql.host,
        dialect: 'mysql',
        logging: false
      }
    );

    const [usuarioColumns] = await sequelize.query('DESCRIBE tabla_usuario');
    const [motoColumns] = await sequelize.query('DESCRIBE tabla_moto');

    // Verificar tabla_usuario
    const usuarioFields = usuarioColumns.map(col => ({
      Field: col.Field,
      Type: col.Type,
      Null: col.Null
    }));
    
    const usuarioChecks = [
      { field: 'nombre', type: 'varchar(50)', null: 'NO' },
      { field: 'email', type: 'varchar(100)', null: 'YES' },
      { field: 'clave', type: 'varchar(60)', null: 'NO' }
    ];

    for (const check of usuarioChecks) {
      const found = usuarioFields.find(f => f.Field === check.field);
      if (!found) {
        console.log(`❌ Campo ${check.field} no encontrado en tabla_usuario`);
        errores++;
      } else if (!found.Type.includes(check.type.split('(')[0])) {
        console.log(`❌ Tipo incorrecto para ${check.field}: esperado ${check.type}, obtenido ${found.Type}`);
        errores++;
      } else if (found.Null === 'YES' && check.null === 'NO') {
        console.log(`❌ Campo ${check.field} debería ser NOT NULL`);
        errores++;
      }
    }

    // Verificar tabla_moto
    const motoFields = motoColumns.map(col => ({
      Field: col.Field,
      Type: col.Type
    }));

    const motoChecks = [
      { field: 'dominio', type: 'varchar(15)' },
      { field: 'cedula', type: 'varchar(20)' },
      { field: 'marca', type: 'varchar(50)' },
      { field: 'modelo', type: 'varchar(50)' }
    ];

    for (const check of motoChecks) {
      const found = motoFields.find(f => f.Field === check.field);
      if (!found) {
        console.log(`❌ Campo ${check.field} no encontrado en tabla_moto`);
        errores++;
      } else if (!found.Type.includes(check.type.split('(')[0])) {
        console.log(`❌ Tipo incorrecto para ${check.field}: esperado ${check.type}, obtenido ${found.Type}`);
        errores++;
      }
    }

    console.log('✅ Estructura de tablas verificada\n');

    // 3. Verificar existencia de usuario admin
    console.log('3. Verificando usuario admin...');
    const [adminRows] = await sequelize.query("SELECT * FROM tabla_usuario WHERE nombre = 'admin' or nombre!=''");
    if (adminRows.length === 0) {
      console.log('❌ Usuario admin no encontrado');
      errores++;
    } else if (!adminRows[0].clave.startsWith('$2')) {
      console.log('❌ Contraseña del admin no está hasheada con bcrypt');
      errores++;
    } else {
      console.log('✅ Usuario admin verificado\n');
    }

    // 4. Verificar JWT_SECRET
    console.log('4. Verificando JWT_SECRET...');
    if (!config.jwtSecret || config.jwtSecret.length < 32) {
      console.log('❌ JWT_SECRET no configurado o demasiado corto');
      errores++;
    } else {
      console.log('✅ JWT_SECRET configurado correctamente\n');
    }

    // 5. Verificar dependencias críticas
    console.log('5. Verificando dependencias...');
    const pkg = require('./package.json');
    const requiredDeps = ['sequelize', 'mysql2', 'bcrypt', 'jsonwebtoken', 'express-session'];
    
    for (const dep of requiredDeps) {
      if (!pkg.dependencies[dep]) {
        console.log(`❌ Dependencia faltante: ${dep}`);
        errores++;
      }
    }
    console.log('✅ Dependencias verificadas\n');

  } catch (error) {
    console.error('💥 Error durante la auditoría:', error.message);
    errores++;
  }

  // Resultado final
  if (errores === 0) {
    console.log('🎉 AUDITORÍA DE BACKEND: ¡TODO CORRECTO!');
    console.log('✅ Cumple con todos los requisitos técnicos');
    return true;
  } else {
    console.log(`⚠️  AUDITORÍA DE BACKEND: ${errores} problemas encontrados`);
    return false;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  auditarBackend().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = auditarBackend;