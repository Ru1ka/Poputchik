import styles from "./OrdersLog.module.css";
import container_styles from '../../UI/containers.module.css'
import ordersStory from '../../assets/icons/Time.svg'
import cn from "classnames"
import Order from "./OrderModel";
import OrderCard from "./OrderCard";

const OrdersLog = (props: { orderList: Order[] }) => {
    return (
        <div className={styles.centeredFrame}>
            <div className={cn(container_styles.flex_row, container_styles.gap_10)}>
                <img className={styles.basicIcon} src={ordersStory}></img>
                <h2>История заявок</h2>
            </div>
            <div className={styles.orderListContainer}>
                {props.orderList.length == 0
                    ? <h3>История заявок пуста</h3>
                    : props.orderList.map((order: Order, i: number) => (
                        <OrderCard order={order} key={i} />
                    ))}
            </div>
        </div>
    );
};

export default OrdersLog;