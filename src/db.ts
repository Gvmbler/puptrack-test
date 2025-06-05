import sql from 'mssql';

const config = {
    user: 'sa',
    password: 'prueba123',
    server: 'DESKTOP-U6V5DK5',
    port: 63909,
    database: 'Puptrack',
    options: {
        encrypt: false,
        trustServerCertificate: true
    } 
};
    
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

export { sql, pool, poolConnect, config };