import { useEffect } from "react";

import { useFormContext } from "../../context";
import { useFormFieldContext } from "./context";

import { FormFieldProps } from "./types";

import styles from "./FormField.module.css";

const FormField = ({ children }: FormFieldProps) => {
    const { formId, pushFieldToSubmit } = useFormContext();
    const { revalidate, value, fieldId } = useFormFieldContext();

    useEffect(() => {
        const onSubmitStart = async () => {
            pushFieldToSubmit({
                fieldId,
                error: await revalidate(),
                value,
            });
        };

        document.addEventListener(`start-${formId}-submit`, onSubmitStart);

        return () => {
            document.removeEventListener(
                `start-${formId}-submit`,
                onSubmitStart
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [revalidate]);

    return (
        <div className={styles.wrapper} id={fieldId}>
            {children}
        </div>
    );
};

export default FormField;
