// limpiar.js
const { Moto } = require('./models');

async function limpiarMotosDePrueba() {
  try {
    const dominiosPrueba = ['ABC123','XYZ789','MOT001','MOT002','MOT003','MOT004','MOT005','MOT006','MOT007','MOT008'];
    await Moto.destroy({ where: { dominio: dominiosPrueba } });
    console.log('🗑️ Motos de prueba eliminadas.');
  } catch (err) {
    console.error('❌ Error al limpiar:', err.message);
  } finally {
    await Moto.sequelize.close();
  }
}

if (require.main === module) {
  limpiarMotosDePrueba();
}