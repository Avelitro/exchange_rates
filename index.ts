import dotenv from 'dotenv';
import { connectDB, disconnectDB, addExchangeRate } from './database';
import { fetchSeriesData } from './functions';

dotenv.config();

async function main() {
    try {
        // Conectar a la base de datos
        await connectDB(); 

        // Obtener tipo de cambio USD
        const usdSeries = await fetchSeriesData(process.env.USD_SERIES_ID ?? '');
        if (usdSeries) {
            console.log(`Tipo de cambio: USD`);
            console.log(`Moneda: ${usdSeries.value}`);
            console.log(`Fecha: ${usdSeries.date}`);
            // Agregar el resultado a la base de datos
            await addExchangeRate(usdSeries.date, 'USD', parseFloat(usdSeries.value));
        }

        // Obtener tipo de cambio EUR
        const eurSeries = await fetchSeriesData(process.env.EUR_SERIES_ID ?? '');
        if (eurSeries) {
            console.log(`Tipo de cambio: EUR`);
            console.log(`Moneda: ${eurSeries.value}`);
            console.log(`Fecha: ${eurSeries.date}`);
            await addExchangeRate(eurSeries.date, 'EUR', parseFloat(eurSeries.value));
        }
    } catch (error) {
        console.error('Error en la ejecución del script:', error);
    } finally {
        // Desconectar después de ejecutar las consultas
        await disconnectDB(); 
    }
}

main();
