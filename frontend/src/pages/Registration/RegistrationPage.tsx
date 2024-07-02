import { useState } from 'react';
import CenteredFrame from '../../components/CenteredFrame'
import { TypesOfLogin } from '../../components/LogInInputTypes';
import LogInStageComponent from '../../components/LogInStageComponent'
import { TypesOfLogInStage } from '../../components/LogInStageTypes';
import styles from './RegistrationPage.module.css'
import { IAuthFormData } from '../../components/Forms/AuthForm/AuthForm';


function RegistrationPage() {
    const [logInStage, setLogInStage] = useState<TypesOfLogInStage>(0);
    const [typeOfInput, setTypeOfInput] = useState<TypesOfLogin>(TypesOfLogin.EMAIL);

    const [formData, setFormData] = useState<IAuthFormData>({
        email: '',
        phone: '',
        person: null,
        companyName: '',
        companyINN: '',
        fullName: '',
        terms: false,
        userAlreadyExists: false,
    });

    const handleInputChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
        console.log(name + ': ' + value);
    };

    const handleCheck = (newValue: boolean) => {
        setFormData({ ...formData, terms: newValue });
    }

    const handleNextStep = (stepIncrement = 1) => {
        setLogInStage(logInStage + stepIncrement);
        console.log(logInStage + stepIncrement);
    };

    const handlePrevStep = () => {
        if (logInStage > 0) {
            setLogInStage(logInStage - 1);
        }
    };

    const changeTypeOfInput = () => {
        setTypeOfInput(typeOfInput === TypesOfLogin.PHONE ? TypesOfLogin.EMAIL : TypesOfLogin.PHONE);
    }

    const setUserAlreadyExists = (newValue: boolean) => {
        setFormData({ ...formData, userAlreadyExists: newValue })
    }

    return (
        <div className={styles.regPage}>
            <CenteredFrame showBackArrow={logInStage > 0} clickBackArrowHandler={handlePrevStep}>
                <LogInStageComponent
                    logInStage={logInStage}
                    typeOfLogin={typeOfInput}
                    changeTypeOfInput={changeTypeOfInput}
                    handleNextStep={handleNextStep}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleCheck={handleCheck}
                    setUserAlreadyExists={setUserAlreadyExists} />
            </CenteredFrame>
        </div>
    )
}

export default RegistrationPage