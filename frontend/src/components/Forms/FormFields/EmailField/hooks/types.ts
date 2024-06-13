export type EmailFieldValue = string;

export type UseEmailFieldResult = {
    revalidate: EmailFieldRevalidate;
    value: EmailFieldValue;
    error: null;
    handleChange: (value: EmailFieldValue) => void;
};

export type UseEmailField = () => UseEmailFieldResult;

export type EmailFieldRevalidate = () => Promise<null>;

export type EmailFieldSubmitEvent = CustomEvent<{
    formId: string;
}>;

export type EmailFieldPushEvent = CustomEvent<{
    value: EmailFieldValue;
    error: null;
}>;
