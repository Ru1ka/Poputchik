import { createContext, useContext } from "react";

type FormFieldContextType = {
    fieldId: string;
    value: unknown;
    error: unknown;
    revalidate: () => Promise<unknown>;
};

export const FormFieldContext = createContext<null | FormFieldContextType>(
    null
);

export const useFormFieldContext = () => {
    const context = useContext(FormFieldContext);

    if (!context) {
        throw new Error(
            "useFormFieldContext must be called within FormFieldContext."
        );
    }

    return context;
};
