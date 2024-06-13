import Submitter from "../Submitter/Submitter";
import PhoneNumberField from "../../FormFields/PhoneNumberField/PhoneNumberField";

import styles from "./Body.module.css";

const Body = () => {
    return (
        <div className={styles.wrapper}>
            <PhoneNumberField />
            <Submitter />
        </div>
    );
};

export default Body;
