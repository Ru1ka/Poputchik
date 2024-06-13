import { FormField } from "../../FormFields/FormField/types";
import { FormSubmitEvent } from "../utils";

export type StartFormSubmit = () => void;
export type OnFormSubmitStart = (
    fieldValues: { [key: string]: unknown },
    event: FormSubmitEvent
) => Promise<unknown>;
export type OnFormSubmitSuccess = <Result>(
    result: Result,
    event: FormSubmitEvent
) => void;
export type OnFormSubmitFailure = <Error>(
    error: Error,
    event: FormSubmitEvent
) => void;
export type OnFormSubmitEnd = (event: FormSubmitEvent) => void;

export type UseFormParams = {
    formId: string;
    fieldValues: { [key: string]: unknown };
    onFormSubmitStart: OnFormSubmitStart;
    onFormSubmitSuccess?: OnFormSubmitSuccess;
    onFormSubmitFailure?: OnFormSubmitFailure;
    onFormSubmitEnd?: OnFormSubmitEnd;
};
export type UseFormResult = {
    formId: string;
    startFormSubmit: StartFormSubmit;
    pushFieldToSubmit: PushFieldToSubmit;
};
export type UseForm = (params: UseFormParams) => UseFormResult;

export type PushFieldToSubmit = (field: FormField) => void;
