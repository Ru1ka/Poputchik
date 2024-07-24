import { TypesOfLogin } from "../../LogInInputTypes";

export interface IAuthFormData {
    email: string;
    phone: string;
    is_organization_account: boolean;
    organization: string;
    inn: string;
    fullName: string;
    terms: boolean;
    userAlreadyExists: boolean;
}

export interface AuthFormStepProps {
    handleNextStep: any;
    formData: IAuthFormData;
    typeOfLogin: TypesOfLogin;
    handleInputChange: (name: string, value: any) => void;
}