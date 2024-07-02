import LogInComponent, { LogInComponentProps } from './LogInComponent';
import GoToRegistration from './GoToRegistration';
import EnterPersonalDataComponent from './EnterMoreDataComponent';
import { TypesOfLogInStage } from './LogInStageTypes';
import CodeConfirmation from './CodeConfirmation';
import { Preview } from './Preview';

interface LogInStageComponentProps extends LogInComponentProps {
    logInStage: TypesOfLogInStage,
    handleCheck: any,
}

const LogInStageComponent = (props: LogInStageComponentProps) => {
    switch (props.logInStage) {
        case TypesOfLogInStage.LOGIN:
            return <LogInComponent
                typeOfLogin={props.typeOfLogin}
                changeTypeOfInput={props.changeTypeOfInput}
                handleNextStep={props.handleNextStep}
                formData={props.formData}
                handleInputChange={props.handleInputChange}
                setUserAlreadyExists={props.setUserAlreadyExists}
            />;
        case TypesOfLogInStage.REDIRECT_TO_CREATING_ACCOUNT:
            return <GoToRegistration
                typeOfLogin={props.typeOfLogin}
                handleNextStep={props.handleNextStep}
                formData={props.formData}
                handleInputChange={props.handleInputChange} />;
        case TypesOfLogInStage.ENTER_THE_INFO:
            return <EnterPersonalDataComponent
                typeOfLogin={props.typeOfLogin}
                handleNextStep={props.handleNextStep}
                formData={props.formData}
                handleInputChange={props.handleInputChange}
                handleCheckboxClick={props.handleCheck} />;
        case TypesOfLogInStage.CODE_CONFIRMATION:
            return <CodeConfirmation
                typeOfLogin={props.typeOfLogin}
                handleNextStep={props.handleNextStep}
                formData={props.formData}
                handleInputChange={props.handleInputChange} />;
        case TypesOfLogInStage.PREVIEW:
            return <Preview
                data={props.formData}
            />
        default:
            return <div>...</div>;
    }
};

export default LogInStageComponent;