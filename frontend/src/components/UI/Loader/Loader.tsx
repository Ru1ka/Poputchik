import styles from "./Loader.module.css";

import { LoaderProps } from "./types";

const Loader = ({ message }: LoaderProps) => {
    return <div className={styles.wrapper}>{message ?? "Загрузка..."}</div>;
};

export default Loader;
