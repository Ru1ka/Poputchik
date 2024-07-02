import container_styles from '../UI/containers.module.css'
import Button from '../UI/Button/Button'
import { ButtonThemes } from '../UI/Button/ButtonTypes'
import { TypesOfLogin } from './LogInInputTypes';
import cn from "classnames";
import { AuthFormStepProps } from './Forms/AuthForm/AuthForm';

export function formatPhoneNumber(phoneNumber: string) {
    // Удаляем все нецифровые символы
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

    // Проверяем, есть ли префикс +7
    if (cleanPhoneNumber.startsWith('7')) {
        return `+7 (${cleanPhoneNumber.slice(1, 4)}) ${cleanPhoneNumber.slice(4, 7)}-${cleanPhoneNumber.slice(7, 9)}-${cleanPhoneNumber.slice(9)}`;
    } else {
        return `+7 (${cleanPhoneNumber.slice(0, 3)}) ${cleanPhoneNumber.slice(3, 6)}-${cleanPhoneNumber.slice(6, 8)}-${cleanPhoneNumber.slice(8)}`;
    }
}

interface GoToRegistrationProps extends AuthFormStepProps {
    typeOfLogin: TypesOfLogin,
}

function GoToRegistration(props: GoToRegistrationProps) {

    return (
        <div className={cn(container_styles.flex_col, container_styles.formContainer)}>
            <div className={cn(container_styles.flex_col, container_styles.gap_10)}>
                <p className="hint">
                    {"Мы не нашли в базе данных "
                        + (props.typeOfLogin == "phone" ? "номер телефона" : "почту")}
                </p>
                <h2>
                    {props.typeOfLogin == "phone" ? formatPhoneNumber(props.formData.phone) : props.formData.email}
                </h2>
            </div>
            <h2>
                {"Создать аккаунт с "
                    + (props.typeOfLogin == "phone" ? "этим номером телефона"
                        : "этой почтой")}
            </h2>

            <div className={cn(container_styles.flex_row, container_styles.gap_20)}>
                <Button
                    children={"Физическое лицо"}
                    buttonTheme={ButtonThemes.RED_FILLED}
                    onClick={() => {
                        props.handleNextStep();
                        props.handleInputChange('person', 'natural');
                    }} />
                <Button
                    children={"Юридическое лицо"}
                    buttonTheme={ButtonThemes.RED_FILLED}
                    onClick={() => {
                        props.handleNextStep();
                        props.handleInputChange('person', 'legal');
                    }} />
            </div>
        </div>
    )
}

export default GoToRegistration