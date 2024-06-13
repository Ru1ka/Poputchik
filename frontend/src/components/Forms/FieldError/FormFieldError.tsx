import { FormFieldErrorProps } from "./types";

import styles from "./FormFieldError.module.css";

const FormFieldError = ({ error }: FormFieldErrorProps) => {
    return <span className={styles.wrapper}>{error ? error.message : ""}</span>;
};

export default FormFieldError;
