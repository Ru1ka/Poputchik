import cn from "classnames";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Input from '../UI/Input/Input'
import { InputThemes } from '../UI/Input/InputTypes'
import styles from './LogInComponent.module.css'
import container_styles from '../UI/containers.module.css'
import Button from '../UI/Button/Button'
import { ButtonThemes } from '../UI/Button/ButtonTypes'
import { buttonStyle, containerStyle, inputStyle } from './PhoneInputStyling'
import { AuthFormStepProps } from './Forms/AuthForm/AuthForm'
import fetchPostCheckUserExists from "../fetch_functions/fetchPostCheckUserExists";

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
                <PhoneInput
                    // className={styles.phone_input}
                    
                    inputClass={styles.phone_input}
                    country={'ru'}
                    onlyCountries={['ru']}
                    disableDropdown
                    disableSearchIcon={true}
                    countryCodeEditable={false}
                    value={props.formData.phone}
                    placeholder={"+7 (999) 999-99-99"}
                    onChange={(phone: string) => { props.handleInputChange('phone', phone) }}
                    containerStyle={containerStyle}
                    buttonStyle={buttonStyle}
                    inputStyle={inputStyle}
                    inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: true
                    }} />
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