# Registro de Motos 🏍️

Sistema para gestionar motos (público y administrador).

## 📁 Estructura del Proyecto

proyecto/
├── backend/          # API REST + lógica de negocio
└── frontend/         # Interfaz de usuario React

## ⚙️ Requisitos

- Node.js v18+
- npm
- MySQL (local o en Clever Cloud)

## 🚀 Instalación

1. Clonar el repositorio
git clone https://github.com/tu-usuario/registro-motos.git
cd registro-motos

2. Instalar dependencias del backend
cd backend
npm install

3. Instalar dependencias del frontend
cd ../frontend
npm install

## ⚡ Variables de Entorno

Backend .env.development
# MySQL Local
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=congreso22
MYSQL_DATABASE=bd_motos

# MySQL Clever Cloud (alternativa)
# MYSQL_HOST=bwxl311hfqzk3zi30acj-mysql.services.clever-cloud.com
# MYSQL_USER=u6a7j5uc813txmvj
# MYSQL_PASSWORD=TZADlnE3V0dw7xKUfDik
# MYSQL_DATABASE=bwxl311hfqzk3zi30acj

SESSION_SECRET=21ecd78e5ca9d581ca73e797292ae6997e0cf94667da586effaaf15a01063b52
JWT_SECRET=9b960971530b20249468b44612beb5a1b66fb8154a94fd3db739f75d4e9fd5af
FRONTEND_URL=http://localhost:3000

Frontend .env.development
VITE_API_BASE_URL=http://localhost:3001

> 💡 Nota: En producción, estas variables se configuran en Render/Clever Cloud.

## 🗃️ Base de Datos (Migraciones Integradas)

No hay archivos de migración separados.  
La base de datos se inicializa automáticamente al iniciar el backend:

- Tablas creadas: tabla_moto, tabla_usuario
- Usuario admin: admin / 1234
- Campo email incluido en tabla_usuario (para JWT)
- Ubicación: backend/app.js (bloque de inicialización con Sequelize)

> ✅ El sistema es idempotente: se puede ejecutar múltiples veces sin errores.
> ✅ Si las tablas existen sin la columna 'email', borrarlas y reiniciar → se recrean automáticamente.

## ▶️ Ejecutar en Desarrollo

Terminal 1 (backend):
cd backend
npm start
# Servidor en http://localhost:3001

Terminal 2 (frontend):
cd frontend
npm run dev
# Interfaz en http://localhost:3000

## 🧪 Para Testear el Proyecto

Credenciales de prueba
- Usuario admin: admin
- Contraseña: 1234

Flujos a probar
1. Vista pública (/): listar y buscar motos
2. Login: acceder con credenciales de admin
3. Gestión de motos: crear, editar, borrar
4. Gestión de usuarios: crear, editar, borrar
5. Logout: cerrar sesión y volver a vista pública

Endpoints importantes
- GET /api/motos - Lista motos (pública)
- POST /api/auth/login - Iniciar sesión (sesiones tradicionales)
- POST /api/auth/jwt/login - Iniciar sesión (con JWT)
- GET /api/usuarios - Lista usuarios (admin)

## 🎨 Características del Frontend

- Vista pública: sin login, solo lectura
- Vista admin: CRUD completo
- Diseño responsive: funciona en móvil y escritorio
- Footer discreto: en todas las páginas (excepto login)

## 🛠️ Tecnologías Utilizadas

Backend
- Node.js + Express
- Sequelize (ORM para MySQL)
- mysql2 (driver de base de datos)
- bcrypt (hash de contraseñas)
- jsonwebtoken (autenticación JWT)
- express-session (gestión de sesiones tradicionales)

Frontend
- React + Vite
- React Router DOM
- Axios (cliente HTTP con soporte JWT)
- Context API (gestión de autenticación)

## 📦 Scripts Útiles

Backend
- npm start - Iniciar servidor
- npm run dev - Iniciar con nodemon (si está configurado)

Frontend
- npm run dev - Iniciar servidor de desarrollo
- npm run build - Generar versión de producción
- npm run preview - Previsualizar build

## 🚨 Solución de Problemas Comunes

"Cannot find module 'dotenv'"
cd backend
npm install

Error de conexión a MySQL
- Verificar credenciales en .env.development
- Asegurarse que MySQL esté corriendo
- Confirmar que la base de datos bd_motos exista
- Si hay error "Unknown column 'email'", borrar tablas y reiniciar

Sesión no persiste
- Verificar que SESSION_SECRET esté definido
- Confirmar que las cookies no estén bloqueadas

JWT no funciona
- Verificar que JWT_SECRET esté definido
- Asegurarse que el frontend envíe el token en el header Authorization

## 📞 Soporte

Para preguntas o problemas: diegovazquezlavaska@gmail.com