import { FieldLabelProps } from "./types";

import styles from "./FormFieldLabel.module.css";

const FormFieldLabel = ({ label, fieldId }: FieldLabelProps) => {
    return (
        <label className={styles.label} htmlFor={fieldId}>
            {label}
        </label>
    );
};

export default FormFieldLabel;
