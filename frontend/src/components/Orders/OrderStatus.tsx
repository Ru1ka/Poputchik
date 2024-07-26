import styles from "./OrdersLog.module.css";
import Confirmed from "../../assets/icons/Confirmed_2.svg";
import On_the_way from "../../assets/icons/On_the_way.svg";
import Flag from "../../assets/icons/Flag.svg";
import Dashed_line from "../../assets/icons/Dashed_line.svg";
import Line from "../../assets/icons/Line.svg";

import cn from "classnames";

const OrderStatusElement = (props: { status: string }) => {
    return (
        // "Created" | "Transit" | "Delivered"
        <div className={styles.orderStatusContainer}>
            <img src={Confirmed} className={cn(styles.img, (props.status == "Created" ? styles.active : styles.inactive))} style={{ height: 14}}/>
            <img src={props.status == "Created" ? Dashed_line : Line} className={cn(styles.line, (props.status == "Created" ? styles.active : styles.inactive))} />
            <img src={On_the_way} className={cn(styles.img, (props.status == "Transit" ? styles.active : styles.inactive))} />
            <img src={props.status == "Transit" ? Dashed_line : Line} className={cn(styles.line, (props.status == "Transit" ? styles.active : styles.inactive))} />
            <img src={Flag} className={cn(styles.img, styles.inactive)} />
            <div className="hint">{props.status == "Delivered" ? "Заявка завершена": (props.status == "Transit" ? "В пути" : "Заявка принята")}</div>
        </div>
    )
}

export default OrderStatusElement;