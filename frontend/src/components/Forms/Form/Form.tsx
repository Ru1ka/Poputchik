import { FormProps } from "react-router-dom";

const Form = ({ children }: FormProps) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return <form onSubmit={handleSubmit}>{children}</form>;
};

export default Form;
