import { HOME_PAGE } from "../../router/paths";
import { useNavigate } from "react-router-dom";

import { LogoProps } from "./types";

import logoFull from "./../../assets/images/logoFull.svg";
import styles from "./Logo.module.css";
import cn from "classnames";

const Logo = ({ navigateToHome = false }: LogoProps) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        if (!navigateToHome) {
            return;
        }

        navigate(HOME_PAGE);
    };

    return (
        <img
            className={cn(navigateToHome && styles.pointer)}
            onClick={() => handleLogoClick()}
            alt="Логтип попутчика"
            src={logoFull}
        />
    );
};

export default Logo;
