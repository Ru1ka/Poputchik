import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { UseForm } from "./types";
import { FormField } from "../../FormFields/FormField/types";

import { FormSubmitEvent } from "../utils";

import { LOADER_PAGE } from "../../../../router/paths";

export const useForm: UseForm = ({
    formId,
    fieldValues,
    onFormSubmitStart,
    onFormSubmitSuccess,
    onFormSubmitFailure,
    onFormSubmitEnd,
}) => {
    const navigate = useNavigate();

    const submitStartEvent = new FormSubmitEvent();
    const submitSuccessEvent = new FormSubmitEvent();
    const submitFailureEvent = new FormSubmitEvent();
    const submitEndEvent = new FormSubmitEvent();

    const fieldsCount = Object.keys(fieldValues).length;
    let readyFieldsCount = 0;
    let error = false;

    const startFormSubmit = useCallback(() => {
        document.dispatchEvent(new CustomEvent(`start-${formId}-submit`));
    }, [formId]);

    const pushFieldToSubmit = (field: FormField) => {
        fieldValues[field.fieldId] = field.value;

        if (!Object.is(field.error, null)) {
            error = true;
        }

        readyFieldsCount++;

        if (readyFieldsCount < fieldsCount) {
            return;
        }

        readyFieldsCount = 0;

        if (error) {
            error = false;
            return;
        }

        _onFormSubmitStart(fieldValues);
    };

    const _onFormSubmitStart = (fieldValues: { [key: string]: unknown }) => {
        onFormSubmitStart(fieldValues, submitStartEvent)
            .then((result) => _onFormSubmitSuccess(result))
            .catch((error) => _onFormSubmitFailure(error))
            .finally(_onFormSubmitEnd);

        if (submitStartEvent.defaultPrevented) {
            return;
        }

        navigate(LOADER_PAGE, {
            state: {
                message: "Отправляем данные на сервер...",
            },
        });
    };

    const _onFormSubmitSuccess = (result: unknown) => {
        onFormSubmitSuccess && onFormSubmitSuccess(result, submitSuccessEvent);

        if (submitSuccessEvent.defaultPrevented) {
            return;
        }
    };

    const _onFormSubmitFailure = (error: Error) => {
        onFormSubmitFailure && onFormSubmitFailure(error, submitFailureEvent);

        if (submitFailureEvent.defaultPrevented) {
            return;
        }
    };

    const _onFormSubmitEnd = () => {
        onFormSubmitEnd && onFormSubmitEnd(submitEndEvent);

        if (submitEndEvent.defaultPrevented) {
            return;
        }

        navigate(-1);
    };

    return {
        startFormSubmit,
        pushFieldToSubmit,
        formId,
    };
};
