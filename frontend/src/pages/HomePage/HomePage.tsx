import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import { AUTH_PAGE, ORDERS_PAGE } from "../../router/paths";

const HomePage = () => {
    return (
        <div className={styles.wrapper} >
            <Link to={AUTH_PAGE} >Нажмите, чтобы посмотреть на регистрацию</Link>
            <Link to={ORDERS_PAGE} >Нажмите, чтобы посмотреть на историю заявок</Link>
        </div>
    );
};

export default HomePage;
