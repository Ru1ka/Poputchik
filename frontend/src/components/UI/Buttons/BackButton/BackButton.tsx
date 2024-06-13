import { useNavigate } from "react-router-dom";
import backIcon from "./../../../../assets/icons/backIcon.svg";

import styles from "./BackButton.module.css";

const BackButton = () => {
    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate(-2);
    };

    return (
        <span className={styles.wrapper} onClick={handleBackButtonClick}>
            <img className={styles.backButton} src={backIcon} alt="" />
        </span>
    );
};

export default BackButton;
