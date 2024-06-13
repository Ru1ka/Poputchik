import styles from "./Button.module.css";
import cn from "classnames";

import { ButtonProps } from "./types";

const Button = ({
    children,
    buttonTheme = "background_red",
    classes = [],
    ...props
}: ButtonProps) => {
    return (
        <button
            type="button"
            className={cn(styles.button, styles[buttonTheme], ...classes)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
