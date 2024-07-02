import { IAuthFormData } from "../components/Forms/AuthForm/AuthForm";
import { TypesOfLogin } from "../components/LogInInputTypes";

export async function fetchPostVerifyOtpSignIn(typeOfLogin: TypesOfLogin, phone: string, email: string, otp: string) {
    interface SignInData {
        OTP: string;
        totp_contact_type: "phone" | "email";
        phone: string | undefined;
        email: string | undefined;
    }

    const bodyData: SignInData = {
        OTP: otp,
        totp_contact_type: typeOfLogin,
        phone: typeOfLogin === "phone" ? phone : undefined,
        email: typeOfLogin === "email" ? email : undefined,
    };

    const body = JSON.stringify(bodyData);

    try {
        const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/auth/sign_in/verify_otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body,
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the /api/auth/sign_in/verify_otp fetch operation:', error);
        throw error;
    }
}

export async function fetchPostVerifyOtpRegister(typeOfLogin: TypesOfLogin, formData: IAuthFormData, otp: string) {
    interface RegisterData {
        OTP: string;
        totp_contact_type: "phone" | "email";
        phone: string | undefined;
        email: string | undefined;
        name: string;
        user_type: "individual" | "physical";
        inn: string | undefined;
    }

    const bodyData: RegisterData = {
        OTP: otp,
        totp_contact_type: typeOfLogin,
        phone: typeOfLogin === "phone" ? formData.phone : undefined,
        email: typeOfLogin === "email" ? formData.email : undefined,
        name: formData.person == 'legal' ? formData.companyName : formData.fullName,
        user_type: formData.person == 'legal' ? "individual" : "physical",
        inn: formData.person == 'legal' ? formData.companyINN : undefined,
    };

    const body = JSON.stringify(bodyData);

    try {
        const response = await fetch('http://localhost:8000/api/auth/register/verify_otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body,
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the /api/auth/register/verify_otp fetch operation:', error);
        throw error;
    }
}