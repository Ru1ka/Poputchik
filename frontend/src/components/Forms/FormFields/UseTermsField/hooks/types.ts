import { UseTermsFieldValidationError } from "../utils/validate";

export type UseTermsFieldValue = boolean;

export type UseTermsFieldValidationResult = UseTermsFieldValidationError | null;

export type UseTermsFieldResult = {
    revalidate: UseTermsFieldRevalidate;
    value: UseTermsFieldValue;
    error: UseTermsFieldValidationResult;
    handleChange: (value: boolean) => void;
};

export type UseUseTermsField = () => UseTermsFieldResult;

export type UseTermsFieldRevalidate =
    () => Promise<UseTermsFieldValidationResult>;

export type PhoneNumberFieldSubmitEvent = CustomEvent<{
    formId: string;
}>;

export type PhoneNumberFieldPushEvent = CustomEvent<{
    value: UseTermsFieldValue;
    error: UseTermsFieldValidationResult;
}>;
