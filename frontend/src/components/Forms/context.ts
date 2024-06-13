import { PushFieldToSubmit, StartFormSubmit } from "./Form/hooks/types";
import { createContext, useContext } from "react";

type FormContextType = {
    formId: string;
    pushFieldToSubmit: PushFieldToSubmit;
    startFormSubmit: StartFormSubmit;
};

export const FormContext = createContext<null | FormContextType>(null);

export const useFormContext = () => {
    const context = useContext(FormContext);

    if (!context) {
        throw new Error("useFormContext must be called within FormContext.");
    }

    return context;
};
