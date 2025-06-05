import { sql, config } from './db';

async function testConnection() {
    try {
        await sql.connect(config);
        console.log('Conexión exitosa a SQL Server');
    } catch (err) {
        console.error('Error al conectar:', err);
    }
}   

testConnection();