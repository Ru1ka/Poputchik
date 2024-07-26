import Order from '../components/Orders/OrderModel';
import { SERVER_ROUTE } from '../constants';

const fetchUpdateOrder = async (
  id: number,
  cargoValue: string,
  costValue: number,
  weightValue: number,
  amountValue: number,
  date: string,
  onLoadingCityValue: string,
  onLoadingValue: string,
  onLoadingPhoneValue: string,
  onUnloadingCityValue: string,
  onUnloadingValue: string,
  onUnloadingPhoneValue: string,
  temperatureCondition: boolean,
  status: string,
  distanceValue: number,
  additionalLoadingPoints: { locality: string, address: string, phone: string }[],
  VAT: boolean,
  readableWeight: string
): Promise<Order> => {
  try {
    const requestBody = {
      id: id,
      cargo: cargoValue,
      cost: costValue,
      weight: weightValue,
      amount: amountValue,
      loading_time: date,
      distance: distanceValue,
      loading_points: [{
        locality: onLoadingCityValue,
        address: onLoadingValue,
        phone: onLoadingPhoneValue
      }, ...additionalLoadingPoints],
      unloading_points: [{
        locality: onUnloadingCityValue,
        address: onUnloadingValue,
        phone: onUnloadingPhoneValue
      }],
      temperature_condition: temperatureCondition,
      status: status,
      VAT: VAT,
      readable_weight: readableWeight
    };

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${SERVER_ROUTE}/api/order`, {
      method: 'PUT',
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
};

export default fetchUpdateOrder;
