// auditoria-completa.js
const path = require('path');
const { spawn } = require('child_process');

async function ejecutarAuditoria(script, directorio) {
  return new Promise((resolve) => {
    const proceso = spawn('node', [script], { cwd: directorio });
    
    proceso.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    proceso.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    proceso.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

async function auditoriaCompleta() {
  console.log('🎯 INICIANDO AUDITORÍA COMPLETA DEL SISTEMA\n');
  
  // Auditar backend
  console.log('=== AUDITORÍA BACKEND ===');
  const backendOk = await ejecutarAuditoria('auditoria-backend.js', path.join(__dirname, 'backend'));
  
  console.log('\n=== AUDITORÍA FRONTEND ===');
  const frontendOk = await ejecutarAuditoria('auditoria-frontend.js', path.join(__dirname, 'frontend'));
  
  console.log('\n=== RESULTADO FINAL ===');
  if (backendOk && frontendOk) {
    console.log('🎉 ¡AUDITORÍA COMPLETA EXITOSA!');
    console.log('✅ El sistema cumple con todos los requisitos técnicos');
    process.exit(0);
  } else {
    console.log('⚠️  AUDITORÍA COMPLETA: Problemas detectados');
    process.exit(1);
  }
}

if (require.main === module) {
  auditoriaCompleta();
}