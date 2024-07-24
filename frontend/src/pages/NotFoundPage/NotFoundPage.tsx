import { useNavigate } from "react-router-dom";

import styles from "./NotFoundPage.module.css";
import { MAIN_PAGE } from "../../router/paths";

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate(MAIN_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            <button onClick={handleBackButtonClick}>Назад</button>
            <div>404 Not Found</div>
        </div>
    );
};

export default NotFoundPage;
