import { useCallback, useState } from "react";
import {
    UseTermsFieldValue,
    UseUseTermsField,
    UseTermsFieldValidationResult,
} from "./types";
import { validate } from "../utils/validate";

export const useUseTermsField: UseUseTermsField = () => {
    const [value, setValue] = useState<UseTermsFieldValue>(false);
    const [error, setError] = useState<UseTermsFieldValidationResult>(null);

    const revalidate = useCallback(async () => {
        return validateAndSetError(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const validateAndSetError = useCallback((val: UseTermsFieldValue) => {
        const err = validate(val);

        setError(err);

        return err;
    }, []);

    const handleChange = useCallback((val: UseTermsFieldValue) => {
        setValue(val);
    }, []);

    return {
        value,
        error,
        revalidate,
        handleChange,
    };
};
