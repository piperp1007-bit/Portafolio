// =========================================
// ARCHIVO DE CONEXIÓN A POSTGRESQL (db.js)
// =========================================

// 1. Importamos la clase Pool del paquete 'pg'
const { Pool } = require('pg');

// 2. Configuramos las credenciales de tu base de datos
// Por favor, cambia estos valores por los reales de tu PostgreSQL local
const pool = new Pool({
    user: 'postgres',        // Tu usuario de PostgreSQL (suele ser 'postgres')
    host: 'localhost',       // El servidor donde está la BD (localhost si es tu PC)
    database: 'cognos_db',   // El nombre de la base de datos que creaste
    password: 'lol1234567',// La contraseña de tu usuario de PostgreSQL
    port: 5432,              // El puerto por defecto de PostgreSQL
});

// 3. Verificamos que la conexión sea exitosa
pool.on('connect', () => {
    console.log('🟢 Conexión exitosa a la base de datos PostgreSQL de Cognos');
});

// 4. Exportamos el 'pool' para poder usarlo en nuestro server.js
module.exports = pool;