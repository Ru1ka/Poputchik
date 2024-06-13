import CheckboxInput from "../../../UI/CheckboxInput/CheckboxInput";
import FormField from "../FormField/FormField";
import { FormFieldContext } from "../FormField/context";
import { useUseTermsField } from "./hooks/useUseTermsField";

const fieldId = "useTerms";

const UseTermsField = () => {
    const { handleChange, revalidate, error, value } = useUseTermsField();

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
                <CheckboxInput
                    id={fieldId + "Input"}
                    checked={value}
                    handleChange={handleChange}
                    label={
                        <span style={{ fontFamily: "inherit" }}>
                            Согласен с{" "}
                            <a
                                style={{ fontFamily: "inherit" }}
                                href="https://ya.ru/?neuro=1"
                            >
                                правилами использования
                            </a>
                        </span>
                    }
                />
            </FormField>
        </FormFieldContext.Provider>
    );
};

export default UseTermsField;
