import { ButtonPropsType } from './ButtonTypes';

import styles from './Button.module.css';
import cn from 'classnames';

const Button = ({children, buttonTheme, ...props}: ButtonPropsType) => {
    return (
        <button
            {...props}
            className={cn(styles.button, styles.clickable, styles[buttonTheme], props.className)}
        >{children}</button>
    );
};

export default Button;