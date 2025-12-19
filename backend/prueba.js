// prueba.js
const { Moto } = require('./models');

// Datos de ejemplo
const motosDePrueba = [
  { cedula: '12345678', dominio: 'ABC123', marca: 'Honda', modelo: 'CBR600', tipo: 'Deportiva', uso: 'Particular', cuadro: 'H123456789', motor: 'M987654321', cilindrada: '600', vence: '2026-12-31' },
  { cedula: '23456789', dominio: 'XYZ789', marca: 'Yamaha', modelo: 'R1', tipo: 'Deportiva', uso: 'Particular', cuadro: 'Y234567890', motor: 'M098765432', cilindrada: '1000', vence: '2025-11-30' },
  { cedula: '34567890', dominio: 'MOT001', marca: 'Suzuki', modelo: 'GSX-R750', tipo: 'Deportiva', uso: 'Comercial', cuadro: 'S345678901', motor: 'M109876543', cilindrada: '750', vence: '2027-01-15' },
  { cedula: '45678901', dominio: 'MOT002', marca: 'Kawasaki', modelo: 'Ninja ZX-10R', tipo: 'Deportiva', uso: 'Particular', cuadro: 'K456789012', motor: 'M210987654', cilindrada: '1000', vence: '2026-08-20' },
  { cedula: '56789012', dominio: 'MOT003', marca: 'Ducati', modelo: 'Panigale V4', tipo: 'Deportiva', uso: 'Particular', cuadro: 'D567890123', motor: 'M321098765', cilindrada: '1100', vence: '2028-03-10' },
  { cedula: '67890123', dominio: 'MOT004', marca: 'BMW', modelo: 'S1000RR', tipo: 'Deportiva', uso: 'Comercial', cuadro: 'B678901234', motor: 'M432109876', cilindrada: '1000', vence: '2025-10-05' },
  { cedula: '78901234', dominio: 'MOT005', marca: 'Triumph', modelo: 'Street Triple', tipo: 'Naked', uso: 'Particular', cuadro: 'T789012345', motor: 'M543210987', cilindrada: '765', vence: '2026-05-22' },
  { cedula: '89012345', dominio: 'MOT006', marca: 'Harley-Davidson', modelo: 'Sportster', tipo: 'Custom', uso: 'Particular', cuadro: 'H890123456', motor: 'M654321098', cilindrada: '1200', vence: '2027-07-18' },
  { cedula: '90123456', dominio: 'MOT007', marca: 'KTM', modelo: '1290 Super Duke', tipo: 'Naked', uso: 'Particular', cuadro: 'K901234567', motor: 'M765432109', cilindrada: '1300', vence: '2026-12-01' },
  { cedula: '01234567', dominio: 'MOT008', marca: 'Aprilia', modelo: 'RSV4', tipo: 'Deportiva', uso: 'Comercial', cuadro: 'A012345678', motor: 'M876543210', cilindrada: '1100', vence: '2025-09-14' }
];

async function insertarMotosDePrueba() {
  console.log('🔍 Verificando conexión y preparando inserción de motos de prueba...');

  try {
    // Aseguramos que la tabla exista
    await Moto.sequelize.sync({ force: false });

    // Insertamos los 10 registros
    await Moto.bulkCreate(motosDePrueba);
    console.log(`✅ ${motosDePrueba.length} motos de prueba insertadas correctamente.`);
  } catch (error) {
    console.error('❌ Error al insertar motos de prueba:', error.message);
  } finally {
    // Cerramos la conexión para no dejar procesos colgados
    await Moto.sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada.');
  }
}

// Ejecutamos solo si se llama directamente (no al importar)
if (require.main === module) {
  insertarMotosDePrueba();
}

module.exports = insertarMotosDePrueba;