import { InputPropsType } from './InputTypes';

import styles from './Input.module.css';
import container_styles from '../containers.module.css'
import cn from 'classnames';

const Input = ({ inputTheme, errorMessage, isValid, ...props }: InputPropsType) => {
    return (
        <div className={cn(container_styles.flex_col, container_styles.gap_5)}>
            <input
                {...props}
                className={cn(styles.input, styles[inputTheme])}
            />
            {!isValid && <div className={styles.errorMessage} >{errorMessage}</div>}
        </div>

    );
};

export default Input;