import BackHeader from "./components/BackHeader/BackHeader";
import Body from "./components/Body/Body";

import styles from "./CodePage.module.css";

const CodePage = () => {
    return (
        <div className={styles.wrapper}>
            <BackHeader />
            <Body />
        </div>
    );
};

export default CodePage;
