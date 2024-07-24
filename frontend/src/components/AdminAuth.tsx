import { useState } from "react";
import Input from "../UI/Input/Input";
import { InputThemes } from "../UI/Input/InputTypes";
import container_styles from '../UI/containers.module.css'
import cn from "classnames";
import Button from "../UI/Button/Button";
import { ButtonThemes } from "../UI/Button/ButtonTypes";
import fetchPostAdminLogin from "../fetch_functions/fetchAdminLogIn";
import { useNavigate } from "react-router-dom";
import { ORDERS_PAGE } from "../router/paths";


const AdminAuth = () => {
    const navigate = useNavigate();
    function handleSubmitAdminLoginForm() {
        fetchPostAdminLogin(login, password)
            .then((data: any) => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('admin', 'admin');
            })
            .then(() => {
                navigate(ORDERS_PAGE, { replace: false });
            })
    }

    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    return (
        <div className={cn(container_styles.flex_col, container_styles.formContainer)}>
            <h2>Вход в аккаунт администратора</h2>
            <div className={cn(container_styles.flex_col, container_styles.gap_10)}>
                <Input
                    value={login}
                    inputTheme={InputThemes.RED}
                    onChange={(e: any) => setLogin(e.target.value)}
                    placeholder="Логин" />
                <Input
                    value={password}
                    inputTheme={InputThemes.RED}
                    onChange={(e: any) => setPassword(e.target.value)}
                    placeholder="Пароль" />
            </div>
            <Button
                children={"Войти"}
                buttonTheme={ButtonThemes.RED_FILLED}
                onClick={handleSubmitAdminLoginForm} />
        </div>
    )
}

export default AdminAuth;