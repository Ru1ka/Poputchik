import { useCallback, useState } from "react";
import {
    PhoneNumberFieldValue,
    UsePhoneNumberField,
    PhoneNumberFieldValidationResult,
} from "./types";
import { validate } from "../utils/validate";
import { defaultValue, parseValue } from "../utils/parseValue";

export const usePhoneNumberField: UsePhoneNumberField = () => {
    const [value, setValue] = useState<PhoneNumberFieldValue>(defaultValue);
    const [error, setError] = useState<PhoneNumberFieldValidationResult>(null);

    const revalidate = useCallback(async () => {
        return validateAndSetError(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const validateAndSetError = useCallback((val: PhoneNumberFieldValue) => {
        const err = validate(val);

        setError(err);

        return err;
    }, []);

    const handleChange = useCallback((val: PhoneNumberFieldValue) => {
        setValue(parseValue(val));
    }, []);

    return {
        value,
        error,
        revalidate,
        handleChange,
    };
};
