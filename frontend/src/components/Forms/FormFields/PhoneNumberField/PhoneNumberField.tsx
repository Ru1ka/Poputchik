import { usePhoneNumberField } from "./hooks/usePhoneNumberField";

import TextInput from "../../../UI/TextInput/TextInput";
import FormField from "../FormField/FormField";

import { FormFieldContext } from "../FormField/context";
import FormFieldLabel from "../../FieldLabel/FormFieldLabel";
import FormFieldError from "../../FieldError/FormFieldError";

const fieldId = "phoneNumber";

const PhoneNumberField = () => {
    const { handleChange, revalidate, error, value } = usePhoneNumberField();

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
                <FormFieldLabel
                    label="Введите номер телефона"
                    fieldId={fieldId}
                />
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

export default PhoneNumberField;
