// Cargar el archivo .env correcto según el entorno
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: envFile });
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();

// ========================================
// CONFIGURACIÓN BASADA EN VARIABLES DE ENTORNO
// ========================================
const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'congreso22',
    database: process.env.MYSQL_DATABASE || 'bd_motos'
  },
  session: {
    secret: process.env.SESSION_SECRET || 'motos-secret-2025',
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
};

// Habilitar CORS para permitir peticiones desde el frontend
app.use(cors({
  origin: config.frontendUrl,
  credentials: true // ← Permite enviar cookies/sesiones
}));

// Parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones con configuración dinámica
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: config.session.maxAge,
    httpOnly: true,
    secure: config.env === 'production', // HTTPS solo en producción
    sameSite: config.env === 'production' ? 'none' : 'lax'
  }
}));

// ========================================
// SERVIDOR DE ARCHIVOS ESTÁTICOS (SOLO EN PRODUCCIÓN)
// ========================================
if (config.env === 'production') {
  const frontendDist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDist));
  
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// ========================================
// INICIALIZACIÓN DE BASE DE DATOS
// ========================================
async function initDatabase() {
  console.log(`📡 Iniciando en entorno: ${config.env}`);
  console.log(`🗃️  Conectando a base de datos: ${config.mysql.database}`);
  console.log(`👤 Usuario: ${config.mysql.user}`);
  console.log(`📍 Host: ${config.mysql.host}`);
  console.log(`🔌 Puerto: 3306 (predeterminado MySQL)`);

  // Intentar conexión directa con mysql2 para diagnóstico más preciso
  try {
    console.log('🔍 Intentando conexión directa con mysql2...');
    const testConnection = await mysql.createConnection({
      host: config.mysql.host,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
      connectTimeout: 10000, // 10s timeout
      // ssl: config.env === 'production' ? { rejectUnauthorized: false } : false // desactivado para FreeSQLDatabase
    });

    console.log('✅ Conexión directa con mysql2 exitosa.');
    await testConnection.end();

    // Ahora sincronizar con Sequelize
    const sequelize = require('./config/database');
    const { Usuario } = require('./models');
    await sequelize.authenticate();
    console.log('✅ Conexión con Sequelize verificada.');

    await sequelize.sync({ force: false });

    const adminUser = await Usuario.findOne({ where: { nombre: 'admin' } });
    const bcrypt = require('bcrypt');

    if (!adminUser) {
      await Usuario.crearConHash('admin', '1234');
      console.log('🔑 Usuario "admin" creado con contraseña hasheada.');
    } else {
      const esHashBcrypt = adminUser.clave.startsWith('$2b$') || 
                           adminUser.clave.startsWith('$2a$') || 
                           adminUser.clave.startsWith('$2y$');
      
      if (!esHashBcrypt) {
        const nuevoHash = await bcrypt.hash('1234', 10);
        await Usuario.update({ clave: nuevoHash }, { where: { id: adminUser.id } });
        console.log('🔑 Contraseña del usuario "admin" actualizada a hash seguro.');
      } else {
        console.log('👤 Usuario "admin" ya existe con contraseña hasheada.');
      }
    }

    console.log('✅ Tablas sincronizadas y usuario de prueba listo.');

  } catch (err) {
    console.error('❌ Error detallado al conectar con la base de datos:');
    console.error('   Mensaje:', err.message);
    console.error('   Código:', err.code || 'N/A');
    console.error('   Código SQL:', err.sqlState || 'N/A');
    console.error('   Stack:', err.stack ? err.stack.split('\n')[0] : 'N/A');
    throw err; // Propagar para que el catch global lo maneje
  }
}

// ========================================
// RUTAS DE LA API
// ========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/motos', require('./routes/motoRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));

app.get('/api', (req, res) => {
  res.json({ 
    message: 'API de Registro de Motos activa ✅',
    environment: config.env
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================
initDatabase()
  .then(() => {
    app.listen(config.port, '0.0.0.0', () => {
      console.log(`🚀 Backend ${config.env} corriendo en puerto ${config.port}`);
      console.log(`🌐 Frontend esperado en: ${config.frontendUrl}`);
    });
  })
  .catch(err => {
    console.error('💥 Error fatal al iniciar backend. La aplicación se cerrará.');
    process.exit(1);
  });