import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import { AUTH_PAGE } from "../../router/paths";

const HomePage = () => {
    return (
        <div className={styles.wrapper}>
            <Link to={AUTH_PAGE} >Нажмите, чтобы посмотреть на регистрацию</Link>
        </div>
    );
};

export default HomePage;
