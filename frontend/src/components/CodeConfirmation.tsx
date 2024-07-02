import { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import cn from "classnames"
import styles from "./CodeConfirmation.module.css"
import input_styles from '../UI/Input/Input.module.css'
import container_styles from '../UI/containers.module.css'
import Button from '../UI/Button/Button';
import button_styles from '../UI/Button/Button.module.css'
import { ButtonThemes } from '../UI/Button/ButtonTypes';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { AuthFormStepProps } from './Forms/AuthForm/AuthForm';
import { formatPhoneNumber } from './GoToRegistration';
import fetchPostSendCode from '../fetch_functions/fetchPostSendCode';
import { fetchPostVerifyOtpRegister, fetchPostVerifyOtpSignIn } from '../fetch_functions/fetchPostVerifyOtp';

function CodeConfirmation(props: AuthFormStepProps) {
    const numInputs: number = 6;
    const [otp, setOtp] = useState('');
    const [counter, setCounter] = useState<number>(6);

    const handleOtpChange = (newOtp: string) => {
        setOtp(newOtp);
        if (newOtp.length === numInputs) {
            validateOtp(newOtp);
        }
    }

    const validateOtp = (otp: string) => {
        console.log(otp);
        if (props.formData.userAlreadyExists) {
            // /api/auth/sign_in/verify_otp
            fetchPostVerifyOtpSignIn(props.typeOfLogin, props.formData.phone, props.formData.email, otp)
                .then((data: any) => {
                    props.handleNextStep();
                    localStorage.setItem('token', data.token);
                    console.log(data.token);
                })
        } else {
            // /api/auth/register/verify_otp
            fetchPostVerifyOtpRegister(props.typeOfLogin, props.formData, otp)
                .then((data: any) => {
                    props.handleNextStep();
                    localStorage.setItem('token', data.token);
                    console.log(data.token);
                })
        }
    }

    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter]);

    useEffect(() => {
        fetchPostSendCode(props.typeOfLogin, props.formData.phone, props.formData.email)
    }, [])


    return (
        <div className={cn(container_styles.flex_col, container_styles.gap_20)}>
            <div className={cn(container_styles.flex_col, container_styles.gap_10)}>
                <div className={styles.concat_text_elements}>
                    <h2 style={{ width: "min-content" }}>
                        Введите код подтверждения
                    </h2>
                    <Button buttonTheme={ButtonThemes.SQUARE} className={button_styles.red_filled} data-tooltip-id="my-tooltip-1">?</Button>
                    <ReactTooltip
                        id="my-tooltip-1"
                        place="right"
                        content="Полезное пояснение"
                        style={{ fontSize: '12px', padding: '4px 10px' }}
                    />
                </div>
                <div className='hint'>
                    {"Мы отправили его на "
                        + (props.typeOfLogin == "phone" ? `номер ${formatPhoneNumber(props.formData.phone)}`
                            : `почту ${props.formData.email}`)}
                </div>
            </div>
            <OtpInput
                value={otp}
                onChange={handleOtpChange}
                numInputs={numInputs}
                inputType={'tel'}
                inputStyle={cn(input_styles.input, input_styles.square)}
                containerStyle={container_styles.gap_6}
                shouldAutoFocus={true}
                renderInput={(props) => <input {...props} style={{ textAlign: 'center' }} />}
            // renderInput={(props, i) => <input {...props} autoComplete={i == 0 ? "one-time-code" : ""} />}
            />
            {/* {localStorage.getItem('token') !== '' && <div className='hint'>{`Получен токен ${localStorage.getItem('token')}`}</div>} */}
            <div className={cn('hint', styles.concat_text_elements)} style={{ alignSelf: 'center' }} >
                <div className={cn((!counter && (button_styles.red)), (!counter && (button_styles.button)))}
                    onClick={() => {
                        if (!counter) {
                            // Повторная отправка кода
                            setCounter(30);
                            fetchPostSendCode(props.typeOfLogin, props.formData.phone, props.formData.email)
                        }
                    }}>
                    Отправить код повторно
                </div>
                <div style={{ display: counter ? 'block' : 'none' }}>
                    {` через ${counter} сек`}
                </div>
            </div>
            <Button buttonTheme={ButtonThemes.RED}>Не приходит код</Button>
        </div>
    );
}

export default CodeConfirmation