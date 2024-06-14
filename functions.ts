import axios from 'axios';

// Función para obtener datos de tipo de cambio desde Banco de México, recibe el ID de la serie de la moneda
export async function fetchSeriesData(seriesId: string): Promise<{ date: string; value: string } | null> {
    const token = process.env.BANXICO_API_TOKEN;
    if (!token) {
        console.error('Token no encontrado en el archivo .env');
        return null;
    }
    const url = `https://www.banxico.org.mx/SieAPIRest/service/v1/series/${seriesId}/datos/oportuno`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Bmx-Token': token,
                'Accept-Encoding': 'gzip',
            },
        });
        // Verificar si se recibieron datos de la serie
        if (!response.data.bmx || !response.data.bmx.series || response.data.bmx.series.length === 0) {
            console.error('No se encontraron datos válidos en la respuesta');
            return null;
        }
        const seriesData = response.data.bmx.series[0];
        const date = seriesData.datos[0].fecha;
        const value = seriesData.datos[0].dato;
        return { date, value };
    } catch (error) {
        console.error('Error al obtener datos:', error);
        throw new Error('Error al obtener datos de tipo de cambio desde Banco de México');
    }
}
