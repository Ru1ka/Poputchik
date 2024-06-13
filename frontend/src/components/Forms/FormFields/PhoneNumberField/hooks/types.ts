import { PhoneNumberFieldValidationError as PhoneNumberFieldValidationError } from "../utils/validate";

export type PhoneNumberFieldValue = string;

export type PhoneNumberFieldValidationResult =
    PhoneNumberFieldValidationError | null;

export type UsePhoneNumberFieldResult = {
    revalidate: PhoneNumberFieldRevalidate;
    value: PhoneNumberFieldValue;
    error: PhoneNumberFieldValidationResult;
    handleChange: (value: PhoneNumberFieldValue) => void;
};

export type UsePhoneNumberField = () => UsePhoneNumberFieldResult;

export type PhoneNumberFieldRevalidate =
    () => Promise<PhoneNumberFieldValidationResult>;

export type PhoneNumberFieldSubmitEvent = CustomEvent<{
    formId: string;
}>;

export type PhoneNumberFieldPushEvent = CustomEvent<{
    value: PhoneNumberFieldValue;
    error: PhoneNumberFieldValidationResult;
}>;
