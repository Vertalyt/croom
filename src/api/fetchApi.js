import axios from 'axios'

  export async function fetchAPIData(params) {
    const url = 'https://sabzero.biz/api/public/fetch-data.php';
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        throw error;
    }
}