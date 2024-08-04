import Order from '../components/Orders/OrderModel';
import { SERVER_ROUTE } from '../constants';

const fetchCreateOrder = async (
  cargoValue: string, cost: number, weightValue: number, amountValue: number, loadingTime: string, createdAt: string,
  onLoadingCityValue: string, onLoadingValue: string, onLoadingPhoneValue: string,
  onUnloadingCityValue: string, onUnloadingValue: string, onUnloadingPhoneValue: string,
  temperatureCondition: boolean, distanceValue: number,
  additionalLoadingPoints: { locality: string, address: string, phone: string }[],
  VAT: boolean, readableWeight: string
): Promise<Order> => {
  try {
    const requestBody = {
      cargo: cargoValue,
      cost: cost,
      weight: weightValue,
      readable_weight: readableWeight,
      amount: amountValue,
      loading_time: loadingTime,
      created_at: createdAt,
      distance: distanceValue,
      temperature_condition: temperatureCondition,
      VAT: VAT,
      status: 'new',
      loading_points: [{
        locality: onLoadingCityValue,
        address: onLoadingValue,
        phone: onLoadingPhoneValue
      }, ...additionalLoadingPoints],
      unloading_points: [{
        locality: onUnloadingCityValue,
        address: onUnloadingValue,
        phone: onUnloadingPhoneValue
      }]
    };

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${SERVER_ROUTE}/api/order/create_order`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error('Network response was not ok');
    }
    const data: Order = await response.json();
    return data;
  } catch (error) {
    console.error('Error in request:', error);
    throw error;
  }
}

export default fetchCreateOrder;
