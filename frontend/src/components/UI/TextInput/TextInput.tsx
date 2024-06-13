import styles from "./TextInput.module.css";

import { TextInputProps } from "./types";

const TextInput = ({ value, id, handleChange, ...props }: TextInputProps) => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(event.target.value);
    };

    return (
        <input
            {...props}
            name={id}
            id={id}
            value={value}
            onChange={onChange}
            className={styles.input}
            type="text"
        />
    );
};

export default TextInput;
