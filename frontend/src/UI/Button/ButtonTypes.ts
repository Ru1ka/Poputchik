export enum ButtonThemes {
    RED = "red",
    BLACK = "black",
    RED_FILLED = "red_filled",
    GO_BACK_ARROW = "go_back_arrow",
    SQUARE = "square",
    CLOSE_MODAL = "close",
}

export type ButtonPropsType = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode,
    buttonTheme: ButtonThemes,
};