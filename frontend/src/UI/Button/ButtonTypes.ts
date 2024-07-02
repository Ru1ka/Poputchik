export enum ButtonThemes {
    RED = "red",
    RED_FILLED = "red_filled",
    GO_BACK_ARROW = "go_back_arrow",
    SQUARE = "square",
}

export type ButtonPropsType = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode,
    buttonTheme: ButtonThemes,
};