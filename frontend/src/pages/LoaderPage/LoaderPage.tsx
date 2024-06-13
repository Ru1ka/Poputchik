import { useLocation } from "react-router-dom";

import styles from "./LoaderPage.module.css";

import Loader from "../../components/UI/Loader/Loader";
import { LoaderPageState } from "./types";

const LoaderPage = () => {
    const location = useLocation();
    const state = location.state as LoaderPageState;

    return (
        <div className={styles.wrapper}>
            <Loader message={state?.message} />
        </div>
    );
};

export default LoaderPage;
