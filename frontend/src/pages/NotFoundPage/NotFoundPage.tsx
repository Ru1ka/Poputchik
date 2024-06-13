import { useNavigate } from "react-router-dom";

import styles from "./NotFoundPage.module.css";
import { HOME_PAGE } from "../../router/paths";

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate(HOME_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            <button onClick={handleBackButtonClick}>Назад</button>
            <div>404 Not Found</div>
        </div>
    );
};

export default NotFoundPage;
