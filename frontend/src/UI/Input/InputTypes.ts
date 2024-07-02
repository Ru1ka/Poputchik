export enum InputThemes {
    RED = "red",
}

export type InputPropsType = React.InputHTMLAttributes<HTMLInputElement> & {
    // children: React.ReactNode,
    inputTheme: InputThemes,
    errorMessage?: string,
    isValid?: boolean,
};