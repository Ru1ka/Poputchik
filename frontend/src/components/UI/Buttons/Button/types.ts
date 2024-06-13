export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    buttonTheme?: "background_red" | "text_red";
    classes?: string[];
};
