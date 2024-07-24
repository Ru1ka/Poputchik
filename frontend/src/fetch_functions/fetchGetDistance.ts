import { SERVER_ROUTE } from "../constants";

async function fetchGetDistance(
    loadingCity: string, loadingAddress: string, loadingPhone: string,
    unloadingCity: string, unloadingAddress: string, unloadingPhone: string
) {
    try {
        const requestBody = {
            loading_points: [{
                locality: loadingCity,
                address: loadingAddress,
                phone: loadingPhone
            }],
            unloading_points: [{
                locality: unloadingCity,
                address: unloadingAddress,
                phone: unloadingPhone
            }]
        };

        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(SERVER_ROUTE + '/api/order/distance', {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the /api/distance/calculate fetch operation:', error);
        throw error;
    }
}

export default fetchGetDistance;
