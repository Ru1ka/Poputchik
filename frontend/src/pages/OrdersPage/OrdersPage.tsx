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
        if (localStorage.getItem('admin') == undefined) {
            if (localStorage.getItem('token') == undefined) {
                openModal();
            } else {
                fetchGetUserOrders()
                    .then((data: OrderResponse) => {
                        console.log(data);
                        setOrdersList(data.orders);
                    })
            }
        } else {
            fetchGetAllUsersOrders()
                .then((data: UsersWithOrders) => {
                    console.log(data);
                    setUsersWithOrders(data.users);
                })
        }
    }, [])

    useEffect(() => {
        if (!isOpen && localStorage.getItem('token') != undefined) {
            fetchGetUserOrders()
                .then((data: OrderResponse) => {
                    console.log(data);
                    setOrdersList(data.orders);
                })
        }
    }, [isOpen])

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
            {localStorage.getItem('admin') == undefined
                ? <OrdersLog orderList={ordersList} />
                : <AdminOrdersLog orderList={usersWithOrders} />
            }
        </div>
    );
};

export default OrdersPage;
