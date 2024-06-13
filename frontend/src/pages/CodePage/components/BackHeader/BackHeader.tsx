import Logo from "../../../../components/Logo/Logo";
import BackButton from "../../../../components/UI/Buttons/BackButton/BackButton";

import styles from "./BackHeader.module.css";

const BackHeader = () => {
    return (
        <div className={styles.wrapper}>
            <BackButton />
            <Logo />
        </div>
    );
};

export default BackHeader;
