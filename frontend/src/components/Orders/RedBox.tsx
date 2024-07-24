import styles from "./OrdersLog.module.css";
import cn from "classnames";

interface RedBoxProps {
    startImgSrc: string;
    endImgSrc?: string;
    text: string;
    done: boolean;
}

const RedBox = (props: RedBoxProps) => {
    return (
        <div className={cn(styles.redContainer, (props.done ? styles.inactive : "") )} style={{ color: 'white' }}>
            <img className={styles.basicIcon} src={props.startImgSrc} />
            <div>{props.text}</div>
            {props.endImgSrc && <img className={styles.basicIcon} src={props.endImgSrc} />}
        </div>
    );
};

export default RedBox;