import { IAuthFormData } from "./Forms/AuthForm/AuthForm";

export function Preview(props: { data: IAuthFormData }) {
    return (
        <pre>{JSON.stringify(props.data)}</pre>
    )
}