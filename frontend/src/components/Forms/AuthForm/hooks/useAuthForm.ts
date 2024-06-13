import { useForm } from "../../Form/hooks/useForm";
import {
    OnFormSubmitEnd,
    OnFormSubmitStart,
    UseFormResult,
} from "../../Form/hooks/types";
import { useNavigate } from "react-router-dom";
import { CODE_PAGE } from "../../../../router/paths";

export const useAuthForm = (): UseFormResult => {
    const navigate = useNavigate();

    const onFormSubmitStart: OnFormSubmitStart = () => {
        return new Promise((res) => setTimeout(() => res(null), 1000));
    };

    const onFormSubmitEnd: OnFormSubmitEnd = (event) => {
        event.preventDefault();

        navigate(CODE_PAGE);
    };

    const { startFormSubmit, pushFieldToSubmit, formId } = useForm({
        formId: "authForm",
        fieldValues: {
            phoneNumber: "+7 ",
        },
        onFormSubmitStart,
        onFormSubmitEnd,
    });

    return {
        startFormSubmit,
        pushFieldToSubmit,
        formId,
    };
};
