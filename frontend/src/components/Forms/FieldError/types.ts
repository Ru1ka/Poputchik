export type FormFieldErrorProps = {
    error: null | FormFieldError;
};

export type FormFieldError = {
    message: string;
    type: unknown;
};
