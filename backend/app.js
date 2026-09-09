// Cargar el archivo .env correcto según el entorno
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: envFile });
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
app.set('trust proxy', 1); // ← ¡Clave para Render! Confía en el proxy inverso

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
  jwt: {
    secret: process.env.JWT_SECRET || 'registro-motos-jwt-secreto-desarrollo-12345'
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
};

// Configuración dinámica de CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin === 'http://localhost:3000') return callback(null, true);
    if (origin.endsWith('.onrender.com')) return callback(null, true);
    callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true
}));

// Parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: config.session.maxAge,
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'none' : 'lax'
  }
}));

// Middleware de diagnóstico (solo en desarrollo)
if (config.env === 'development') {
  app.use((req, res, next) => {
    console.log('🍪 Cookies recibidas:', req.cookies);
    console.log('🔐 Sesion ID:', req.sessionID);
    next();
  });
}

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

  try {
    console.log('🔍 Intentando conexión directa con mysql2...');
    const testConnection = await mysql.createConnection({
      host: config.mysql.host,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
      connectTimeout: 10000
    });

    console.log('✅ Conexión directa con mysql2 exitosa.');
    await testConnection.end();

    const sequelize = require('./config/database');
    const { Usuario } = require('./models');
    await sequelize.authenticate();
    console.log('✅ Conexión con Sequelize verificada.');

    // Sincroniza las tablas sin forzar (no borra datos existentes)
    await sequelize.sync({ force: false });

    // ✅ NUEVA LÓGICA: Solo crear admin si la tabla está completamente vacía
    const cantidadUsuarios = await Usuario.count();

    if (cantidadUsuarios === 0) {
      // Asumiendo que tu modelo tiene este método estático personalizado
      await Usuario.crearConHash('admin', '1234', 'admin@gmail.com');
      console.log('🔑 Usuario "admin" creado por defecto (tabla de usuarios vacía).');
    } else {
      console.log(`ℹ️ La tabla de usuarios ya tiene ${cantidadUsuarios} registro(s). No se crea el admin por defecto.`);
    }

    console.log('✅ Tablas sincronizadas y verificación de usuarios completada.');

  } catch (err) {
    console.error('❌ Error detallado al conectar con la base de datos:');
    console.error('   Mensaje:', err.message);
    console.error('   Código:', err.code || 'N/A');
    console.error('   Código SQL:', err.sqlState || 'N/A');
    console.error('   Stack:', err.stack ? err.stack.split('\n')[0] : 'N/A');
    throw err;
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
      console.log(`🔐 JWT Secret configurado para entorno: ${config.env}`);
    });
  })
  .catch(err => {
    console.error('💥 Error fatal al iniciar backend. La aplicación se cerrará.');
    process.exit(1);
  });

module.exports = app; // Buena práctica para tests o servidores serverless