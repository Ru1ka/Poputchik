import { CheckboxInputProps } from "./types";

import styles from "./CheckboxInput.module.css";

const CheckboxInput = ({
    handleChange,
    label,
    checked,
    id,
}: CheckboxInputProps) => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(event.target.checked);
    };

    return (
        <label className={styles.label}>
            <input
                onChange={onChange}
                checked={checked}
                type="checkbox"
                id={id}
            />
            {label}
        </label>
    );
};

export default CheckboxInput;
