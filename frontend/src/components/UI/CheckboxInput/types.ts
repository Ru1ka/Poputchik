export type CheckboxInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    handleChange: (value: boolean) => void;
    checked: boolean;
    label: React.ReactNode;
    id: string;
};
