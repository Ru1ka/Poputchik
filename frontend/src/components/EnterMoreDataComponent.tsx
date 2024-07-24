import { AuthFormStepProps, IAuthFormData } from "./Forms/AuthForm/AuthForm"
import container_styles from '../UI/containers.module.css'
import cn from "classnames"
import Input from "../UI/Input/Input"
import { InputThemes } from "../UI/Input/InputTypes"
import Button from "../UI/Button/Button"
import { ButtonThemes } from "../UI/Button/ButtonTypes"
import { useState } from "react"

interface CheckboxProps extends AuthFormStepProps {
    handleCheckboxClick: any
}

interface PersonalDataToBeValidated {
    fullNameIsValid: boolean,
}

function validatePersonalData(formData: IAuthFormData) {
    const personalDataValidationStatus: PersonalDataToBeValidated = {
        fullNameIsValid: formData.fullName !== ""
    }
    return personalDataValidationStatus
}

function EnterPersonalDataComponent(props: CheckboxProps) {
    const [validationInfo, setValidationInfo] = useState<PersonalDataToBeValidated>({ fullNameIsValid: true })

    return (
        <div className={cn(container_styles.flex_col, container_styles.formContainer)}>
            <div className={cn(container_styles.flex_col, container_styles.gap_10)}>
                <h2>
                    {"Регистрация как " + (props.formData.is_organization_account ? "юридическое" : "физическое") + " лицо"}
                </h2>
                <p className="hint" style={{ whiteSpace: 'break-spaces' }}>
                    {"Введите "
                        + (props.formData.is_organization_account ? "данные организации \nдля регистрации как юридическое лицо"
                            : "ФИО для регистрации как физическое лицо")}
                </p>
            </div>

            {props.formData.is_organization_account ?
                <div className={cn(container_styles.flex_col, container_styles.gap_10)}>
                    <Input
                        inputTheme={InputThemes.RED}
                        autoFocus={true}
                        value={props.formData.organization}
                        name="organization"
                        placeholder="Название организации"
                        // Добавить вывод ошибки, если она происходит
                        onChange={(e: any) => { props.handleInputChange('organization', e.target.value) }} />
                    <Input
                        inputTheme={InputThemes.RED}
                        autoFocus={false}
                        value={props.formData.inn}
                        name="inn"
                        placeholder="ИНН"
                        // Добавить вывод ошибки, если она происходит
                        onChange={(e: any) => { props.handleInputChange('inn', e.target.value) }} />
                </div>
                : <Input
                    inputTheme={InputThemes.RED}
                    autoFocus={true}
                    value={props.formData.fullName}
                    name="fullName"
                    style={{ textTransform: 'capitalize'}}
                    errorMessage="Пожалуйста, введите данные"
                    isValid={validationInfo.fullNameIsValid}
                    // Добавить вывод ошибки, если она происходит
                    onChange={(e: any) => { props.handleInputChange('fullName', e.target.value) }} />

            }
            <div className={cn(container_styles.flex_row, container_styles.gap_10)} style={{ alignItems: 'center' }}>
                <Input
                    inputTheme={InputThemes.RED}
                    autoFocus={false}
                    checked={props.formData.terms}

                    name="terms"
                    type="checkbox"
                    // Добавить вывод ошибки, если она происходит
                    onChange={() => { props.handleCheckboxClick(!props.formData.terms) }}
                />
                <div className={cn("hint", container_styles.concat_text_elements)} style={{}}>
                    Согласен с <a href="https://www.google.com">правилами</a> пользования
                </div>
            </div>
            <Button
                children={"Далее"}
                buttonTheme={ButtonThemes.RED_FILLED}
                disabled={(props.formData.is_organization_account && (props.formData.organization == "" || props.formData.inn == "" || !props.formData.terms))
                    || (!props.formData.is_organization_account && (props.formData.fullName == "" || !props.formData.terms))
                }
                onClick={() => {
                    setValidationInfo(validatePersonalData(props.formData));
                    props.handleNextStep();
                    console.log(props.formData)
                }} />
        </div>
    )
}


export default EnterPersonalDataComponent