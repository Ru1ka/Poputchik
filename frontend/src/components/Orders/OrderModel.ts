import { ProfileResponse } from "../../pages/ProfilePage/ProfilePage";

export interface UsersWithOrders {
    users: UserWithOrders[];
}

export interface UserWithOrders extends ProfileResponse {
    orders: Order[];
}

export interface OrderResponse {
    orders: Order[];
}

interface Order {
    id: number;
    readable_id: string;
    customer_id: number;
    cargo: string;
    created_at: string; // Date string in ISO 8601 format
    cost: number;
    distance: number;
    weight: number;
    amount: number;
    temperature_condition: boolean;
    // Created -> Transit -> Delivered
    status: OrderStatus;
    loading_points: LoadingPoint[];
    unloading_points: LoadingPoint[];
    VAT: boolean
}

export enum OrderStatus {
    CREATED = "Created",
    TRANSIT = "Transit",
    DELIVERED = "Delivered",
}

interface LoadingPoint {
    locality: string;
    address: string;
    phone: string;
    lat?: string;
    lon?: string;
    index?: number;
}

export default Order;