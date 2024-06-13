import { useCallback, useState } from "react";
import { EmailFieldValue, UseEmailField } from "./types";

const defaultValue = "";

export const useEmailField: UseEmailField = () => {
    const [value, setValue] = useState<EmailFieldValue>(defaultValue);

    const revalidate = useCallback(async () => {
        return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = useCallback((val: EmailFieldValue) => {
        setValue(val);
    }, []);

    return {
        value,
        error: null,
        revalidate,
        handleChange,
    };
};
