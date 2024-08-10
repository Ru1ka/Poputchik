import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./OrdersPage.module.css";
import Header from "../../components/Header/Header";
import Order, { OrderResponse, UsersWithOrders, UserWithOrders } from "../../components/Orders/OrderModel";
import OrdersLog from "../../components/Orders/OrdersLog";
import fetchGetUserOrders from "../../fetch_functions/fetchGetUserOrders";
import fetchGetAllUsersOrders from "../../fetch_functions/fetchGetAllUsersOrders";
import AdminOrdersLog from "../../components/Admin/AdminOrdersLog";
import { ModalContext } from "../../components/Modal/ModalContext";

const OrdersPage = () => {
    const { isOpen, openModal } = useContext(ModalContext);
    const [ordersList, setOrdersList] = useState<Order[]>([]);
    const [usersWithOrders, setUsersWithOrders] = useState<UserWithOrders[]>([]);
    const location = useLocation();

    useEffect(() => {
        if (!localStorage.getItem('admin')) {
            if (!localStorage.getItem('token')) {
                openModal();
            } else {
                fetchGetUserOrders()
                    .then((data: OrderResponse) => {
                        setOrdersList(data.orders);
                    })
                    .catch(error => console.error('Error fetching orders:', error));
            }
        } else {
            fetchGetAllUsersOrders()
                .then((data: UsersWithOrders) => {
                    setUsersWithOrders(data.users);
                })
                .catch(error => console.error('Error fetching all users orders:', error));
        }
    }, []);

    useEffect(() => {
        if (!isOpen && localStorage.getItem('token')) {
            fetchGetUserOrders()
                .then((data: OrderResponse) => {
                    setOrdersList(data.orders);
                })
                .catch(error => console.error('Error fetching orders:', error));
        }
    }, [isOpen]);

    useEffect(() => {
        if (location.state) {
            const newOrder = location.state.newOrder as Order;
            const updatedOrder = location.state.updatedOrder as Order;

            if (newOrder) {
                setOrdersList(prevOrders => [...prevOrders, newOrder]);
            }
            if (updatedOrder) {
                setOrdersList(prevOrders =>
                    prevOrders.map(order => (order.id === updatedOrder.id ? updatedOrder : order))
                );
            }
        }
    }, [location.state]);


    return (
        <div className={styles.page}>
            <Header />
            {!localStorage.getItem('admin')
                ? <OrdersLog orderList={ordersList}/>
                : <AdminOrdersLog orderList={usersWithOrders}/>
            }
        </div>
    );
};

export default OrdersPage;
