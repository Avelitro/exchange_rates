import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

// Función para conectar con PostgreSQL
export async function connectDB() {
    try {
        await client.connect();
        console.log('Conectado a PostgreSQL');
    } catch (error) {
        console.error('Error de conexión:', error);
        throw new Error('Error de conexión a la base de datos');
    }
}

// Función para desconectar de PostgreSQL
export async function disconnectDB() {
    try {
        await client.end();
        console.log('Conexión cerrada');
    } catch (error) {
        console.error('Error al cerrar la conexión:', error);
        throw new Error('Error al cerrar la conexión a la base de datos');
    }
}

// Función para agregar datos a la tabla 'exchange_rates'
export async function addExchangeRate(dateStr: string, exchangeType: string, currency: number) {
    try {
        const date = formatDate(dateStr);

        const query = `
            INSERT INTO exchange_rates (date, exchange_type, currency)
            VALUES ($1, $2, $3)`;
        await client.query(query, [date, exchangeType, currency]);
        console.log('Datos agregados exitosamente a la tabla exchange_rates');
    } catch (error) {
        console.error('Error al insertar:', error);
        throw new Error('Error al insertar datos en la tabla exchange_rates');
    }
}

// Función para formatear la fecha
export function formatDate(dateStr: string): string {
    const parts = dateStr.split('/');
    if (parts.length !== 3) {
        throw new Error('Formato de fecha inválido. Debe ser DD/MM/YYYY');
    }
    const year = parts[2];
    const month = ('0' + parts[1]).slice(-2);
    const day = ('0' + parts[0]).slice(-2);
    return `${year}-${month}-${day}`;
}
