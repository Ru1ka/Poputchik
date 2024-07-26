import cn from "classnames";
import Input from '../UI/Input/Input'
import { InputThemes } from '../UI/Input/InputTypes'
import container_styles from '../UI/containers.module.css'
import Button from '../UI/Button/Button'
import { ButtonThemes } from '../UI/Button/ButtonTypes'
import { AuthFormStepProps } from './Forms/AuthForm/AuthForm'
import fetchPostCheckUserExists from "../fetch_functions/fetchPostCheckUserExists";
import CustomPhoneInput from "../UI/Input/CustomPhoneInput";

export interface LogInComponentProps extends AuthFormStepProps {
    changeTypeOfInput: () => void;
    setUserAlreadyExists: (newValue: boolean) => void;
}

function LogInComponent(props: LogInComponentProps) {
    return (
        <div className={cn(container_styles.flex_col, container_styles.formContainer)}>
            <div className={cn(container_styles.flex_col, container_styles.gap_10)}>
                <h2>
                    {props.typeOfLogin == "phone" ? "Введите номер телефона" :
                        props.typeOfLogin == "email" ? "Введите почту" : ""}
                </h2>
                <p className="hint">
                    {"На "
                        + (props.typeOfLogin == "phone" ? "него" : "нее")
                        + " будет отправлен 6-значный код"}
                </p>
            </div>

            {props.typeOfLogin == "phone" ?
                <CustomPhoneInput
                    phone={props.formData.phone}
                    value={props.formData.phone}
                    // onChange={(phone: string) => { props.handleInputChange('phone', phone) }}
                    onChange={(phone: string) => { props.handleInputChange('phone', phone) }}
                    autoFocus />
                : <Input
                    inputTheme={InputThemes.RED}
                    autoFocus={true}
                    value={props.formData.email}
                    name="email"
                    // Добавить вывод ошибки, если она происходит
                    onChange={(e: any) => { props.handleInputChange('email', e.target.value) }} />
            }

            <Button
                children={"Далее"}
                buttonTheme={ButtonThemes.RED_FILLED}
                disabled={
                    (props.typeOfLogin == "phone" && props.formData.phone == "")
                    || (props.typeOfLogin == "email" && props.formData.email == "")}
                onClick={() => {
                    fetchPostCheckUserExists(props.typeOfLogin, props.formData.phone, props.formData.email)
                        .then(data => {
                            if (data.user_exists) {
                                props.setUserAlreadyExists(true);
                                props.handleNextStep(3);
                                console.log(data);
                            } else {
                                props.setUserAlreadyExists(false);
                                props.handleNextStep();
                            }
                            console.log('Пользователь существует:', data.user_exists);
                        })
                        .catch(error => {
                            console.error('Ошибка:', error);
                        });
                    console.log(props.formData)
                }} />
            <Button
                children={props.typeOfLogin == "phone" ? "Войти по почте" : "Войти по номеру телефона"}
                buttonTheme={ButtonThemes.RED}
                onClick={props.changeTypeOfInput} />
        </div>
    )
}

export default LogInComponent