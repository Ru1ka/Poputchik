import Button from "../../../UI/Buttons/Button/Button";
import { useFormContext } from "../../context";

import styles from "./Submitter.module.css";

const Submitter = () => {
    const { startFormSubmit } = useFormContext();

    return (
        <Button
            type="button"
            classes={[styles.wrapper]}
            onClick={() => {
                startFormSubmit();
            }}
        >
            Далее
        </Button>
    );
};

export default Submitter;
