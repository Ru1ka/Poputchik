import { InputPropsType } from './InputTypes';

import styles from './Input.module.css';
import container_styles from '../containers.module.css'
import cn from 'classnames';

const Input = ({ inputTheme, errorMessage, isValid, ...props }: InputPropsType) => {
    return (
        <div className={container_styles.flex_col}>
            <input
                {...props}
                className={cn(styles.input, styles[inputTheme])}
            />
            {!isValid && <div className='hint'>{errorMessage}</div>}
        </div>

    );
};

export default Input;