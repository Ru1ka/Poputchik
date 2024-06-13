import { PhoneNumberFieldValue } from "../../Forms/FormFields/PhoneNumberField/hooks/types";

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    handleChange: (value: PhoneNumberFieldValue) => void;
    value: string;
    id: string;
};
