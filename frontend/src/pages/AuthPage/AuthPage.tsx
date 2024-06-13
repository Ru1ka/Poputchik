import AuthForm from "../../components/Forms/AuthForm/AuthForm";
import Logo from "../../components/Logo/Logo";
import styles from "./AuthPage.module.css";

const AuthPage = () => {
    return (
        <div className={styles.wrapper}>
            <Logo />
            <AuthForm />
        </div>
    );
};

export default AuthPage;
