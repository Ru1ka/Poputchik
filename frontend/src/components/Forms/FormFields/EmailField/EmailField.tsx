import { useEmailField } from "./hooks/useEmailField";

import TextInput from "../../../UI/TextInput/TextInput";
import FormField from "../FormField/FormField";

import { FormFieldContext } from "../FormField/context";
import FormFieldLabel from "../../FieldLabel/FormFieldLabel";
import FormFieldError from "../../FieldError/FormFieldError";

const fieldId = "email";

const EmailField = () => {
    const { handleChange, revalidate, error, value } = useEmailField();

    return (
        <FormFieldContext.Provider
            value={{
                revalidate,
                value,
                error,
                fieldId,
            }}
        >
            <FormField>
                <FormFieldLabel label="Введите адрес почты" fieldId={fieldId} />
                <TextInput
                    handleChange={handleChange}
                    value={value}
                    id={fieldId + "Input"}
                    autoFocus
                />
                <FormFieldError error={error} />
            </FormField>
        </FormFieldContext.Provider>
    );
};

export default EmailField;
