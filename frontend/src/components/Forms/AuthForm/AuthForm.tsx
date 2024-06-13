import Form from "../Form/Form";
import { FormContext } from "../context";

import Body from "./Body/Body";
import { useAuthForm } from "./hooks/useAuthForm";

const AuthForm = () => {
    const { startFormSubmit, pushFieldToSubmit, formId } = useAuthForm();

    return (
        <FormContext.Provider
            value={{
                startFormSubmit,
                pushFieldToSubmit,
                formId,
            }}
        >
            <Form>
                <Body />
            </Form>
        </FormContext.Provider>
    );
};

export default AuthForm;
