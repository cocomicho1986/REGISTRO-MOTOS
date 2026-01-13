// frontend/auditoria-frontend.cjs
const fs = require('fs');
const path = require('path');

function auditarFrontend() {
  console.log('🔍 INICIANDO AUDITORÍA DE FRONTEND\n');
  let errores = 0;

  try {
    // 1. Verificar estructura de archivos clave
    console.log('1. Verificando estructura de archivos...');
    const archivosClave = [
      'src/contexts/AuthContext.jsx',
      'src/contexts/AuthContextInstance.js',
      'src/hooks/useMotoForm.js',
      'src/hooks/useUsuarioForm.js',
      'src/components/MotoForm.jsx',
      'src/components/UsuarioForm.jsx',
      'src/services/api.js'
    ];

    for (const archivo of archivosClave) {
      const ruta = path.join(__dirname, archivo);
      if (!fs.existsSync(ruta)) {
        console.log(`❌ Archivo faltante: ${archivo}`);
        errores++;
      }
    }
    console.log('✅ Estructura de archivos verificada\n');

    // 2. Verificar contenido de AuthContext
    console.log('2. Verificando AuthContext (soporte JWT)...');
    const authContextPath = path.join(__dirname, 'src/contexts/AuthContext.jsx');
    if (fs.existsSync(authContextPath)) {
      const contenido = fs.readFileSync(authContextPath, 'utf8');
      if (!contenido.includes('/auth/jwt/login')) {
        console.log('❌ AuthContext no tiene soporte para JWT');
        errores++;
      }
      // Verificación más flexible para token storage
      const tieneTokenStorage = contenido.includes('localStorage.getItem(\'token\')') || 
                               contenido.includes('localStorage.getItem("token")');
      if (!tieneTokenStorage) {
        console.log('❌ AuthContext no maneja tokens JWT');
        errores++;
      }
    }
    console.log('✅ AuthContext verificado\n');

    // 3. Verificar validaciones en formularios
    console.log('3. Verificando validaciones en formularios...');
    const motoFormPath = path.join(__dirname, 'src/components/MotoForm.jsx');
    if (fs.existsSync(motoFormPath)) {
      const contenido = fs.readFileSync(motoFormPath, 'utf8');
      if (!contenido.includes('maxLength={15}') || !contenido.includes('dominio')) {
        console.log('❌ Formulario de motos no tiene validación de longitud para dominio');
        errores++;
      }
      if (!contenido.includes('error-message')) {
        console.log('❌ Formulario de motos no muestra mensajes de error');
        errores++;
      }
    }

    const usuarioFormPath = path.join(__dirname, 'src/components/UsuarioForm.jsx');
    if (fs.existsSync(usuarioFormPath)) {
      const contenido = fs.readFileSync(usuarioFormPath, 'utf8');
      if (!contenido.includes('maxLength={50}') || !contenido.includes('nombre')) {
        console.log('❌ Formulario de usuarios no tiene validación de longitud para nombre');
        errores++;
      }
    }
    console.log('✅ Validaciones de formularios verificadas\n');

    // 4. Verificar api.js (interceptor JWT) - ¡MEJORADO!
    console.log('4. Verificando api.js (interceptor JWT)...');
    const apiPath = path.join(__dirname, 'src/services/api.js');
    if (fs.existsSync(apiPath)) {
      const contenido = fs.readFileSync(apiPath, 'utf8');
      
      // Verificaciones más inteligentes y flexibles
      const tieneTokenStorage = contenido.includes('localStorage.getItem(\'token\')') || 
                               contenido.includes('localStorage.getItem("token")');
      
      const tieneAuthorization = contenido.includes('Authorization') && 
                                (contenido.includes('Bearer') || 
                                 contenido.includes('config.headers.Authorization') ||
                                 contenido.includes('headers.Authorization'));
      
      const tieneInterceptor = contenido.includes('interceptors.request.use');
      
      if (!tieneTokenStorage) {
        console.log('❌ api.js no recupera el token de localStorage');
        errores++;
      }
      if (!tieneAuthorization) {
        console.log('❌ api.js no configura el header Authorization con Bearer token');
        errores++;
      }
      if (!tieneInterceptor) {
        console.log('❌ api.js no tiene interceptor de requests');
        errores++;
      }
      
      if (tieneTokenStorage && tieneAuthorization && tieneInterceptor) {
        console.log('✅ api.js tiene interceptor JWT completo');
      }
    } else {
      console.log('❌ Archivo api.js no encontrado');
      errores++;
    }

    // 5. Verificar package.json
    console.log('5. Verificando dependencias frontend...');
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    const requiredDeps = ['react', 'react-router-dom', 'axios'];
    
    for (const dep of requiredDeps) {
      if (!pkg.dependencies[dep]) {
        console.log(`❌ Dependencia frontend faltante: ${dep}`);
        errores++;
      }
    }
    console.log('✅ Dependencias frontend verificadas\n');

  } catch (error) {
    console.error('💥 Error durante la auditoría:', error.message);
    errores++;
  }

  // Resultado final
  if (errores === 0) {
    console.log('🎉 AUDITORÍA DE FRONTEND: ¡TODO CORRECTO!');
    console.log('✅ Cumple con todos los requisitos técnicos');
    return true;
  } else {
    console.log(`⚠️  AUDITORÍA DE FRONTEND: ${errores} problemas encontrados`);
    return false;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  auditarFrontend();
}

module.exports = auditarFrontend;