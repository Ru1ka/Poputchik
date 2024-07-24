import { Tooltip as ReactTooltip, TooltipRefProps } from "react-tooltip";
import { AUTH_PAGE, MAIN_PAGE, ORDER_PAGE, ORDERS_PAGE, PROFILE_PAGE } from '../../router/paths';
import styles from "./Header.module.css";
import logo from '../../assets/icons/Logo_full.svg';
import Profile from '../../assets/icons/Profile.svg';
import List_arrow from '../../assets/icons/List_arrow.svg';
import Support from '../../assets/icons/Customer_support.svg';
import Exit from '../../assets/icons/Exit.svg';
import Burger from '../../assets/icons/Burger_menu.svg';

import cn from "classnames"
import Button from "../../UI/Button/Button";
import { ButtonThemes } from "../../UI/Button/ButtonTypes";
import { useEffect, useRef, useState } from "react";
import fetchGetUserProfile from "../../fetch_functions/fetchGetUserProfile";
import { ProfileResponse } from "../../pages/ProfilePage/ProfilePage";

const Header = () => {
    const poputchik_email: string = "support@putchik.ru";

    const handleEMailClick = () => {
        window.location.href = `mailto:${poputchik_email}`;
    };

    const handleGoToProfilePageClick = () => {
        window.location.href = PROFILE_PAGE;
    }

    const handleGoToMainPageClick = () => {
        window.location.href = MAIN_PAGE;
    }

    const handleExitClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('admin');
        window.location.href = AUTH_PAGE;
    }

    const [dropdownState, setDropdownState] = useState(false);
    const handleChangeDropdownState = () => {
        setDropdownState(!dropdownState);
    }

    const tooltipRef1 = useRef<TooltipRefProps>(null);

    useEffect(() => {
        let username = localStorage.getItem('username');

        if (localStorage.getItem('token') == undefined) {
            return;
        } else if (localStorage.getItem('admin') === 'admin') {
            setUsername('admin');
            localStorage.setItem('username', 'admin');
        } else if (username == undefined) {
            fetchGetUserProfile()
                .then((data: ProfileResponse) => {
                    console.log(data);
                    let data_name = data.is_organization_account ? data.organization?.organization_name : data.name;
                    setUsername(data_name ? data_name : '');
                    localStorage.setItem('username', data_name ? data_name : '');
                })
        } else {
            setUsername(username);
        }
    }, [])

    const [username, setUsername] = useState<string>('');

    return (
        <div className={styles.headerWrapper}>
            <div className={styles.centeredFrame}>
                <img className={styles.logo} src={logo} onClick={handleGoToMainPageClick}></img>
                <div className={cn(styles.linksSection, styles.onlyBigScreen)}>
                    <a href={ORDER_PAGE}><h3>Оформить заявку</h3></a>
                    <a href={ORDERS_PAGE}><h3>История заявок</h3></a>
                    <ReactTooltip
                        id="get-support-tooltip"
                        place="bottom"
                        className={styles.tooltip}
                        clickable={true}
                        noArrow={true}
                        offset={38}
                        opacity={1}
                        delayHide={200}
                        disableStyleInjection={true}
                    >
                        <h3 className={styles.tooltipRow} onClick={handleEMailClick}>
                            <img src={Support} />
                            <div>{poputchik_email}</div>
                        </h3>
                    </ReactTooltip>
                    <h3 className={styles.support} data-tooltip-id="get-support-tooltip">
                        Поддержка
                        <img src={List_arrow} />
                    </h3>
                </div>
                <ReactTooltip
                    id="profile-options"
                    place="bottom"
                    className={cn(styles.tooltip, styles.littleTooltip, styles.onlyBigScreen)}
                    clickable={true}
                    noArrow={true}
                    offset={38}
                    opacity={1}
                    delayHide={200}
                    disableStyleInjection={true}
                    openEvents={{ ['click']: true }}
                    closeEvents={{ ['click']: true }}
                >
                    {localStorage.getItem('admin') == undefined &&
                        <Button buttonTheme={ButtonThemes.RED_FILLED} className={cn(styles.littleRow, styles.red)} onClick={handleGoToProfilePageClick}>
                            <img src={Profile} />
                            Личный кабинет
                        </Button>}
                    <Button buttonTheme={ButtonThemes.RED} className={cn(styles.littleRow, styles.redText)} onClick={handleExitClick}>
                        <img src={Exit} />
                        Выйти из аккаунта
                    </Button>
                </ReactTooltip>
                <div className={cn(styles.profile, styles.onlyBigScreen)} data-tooltip-id="profile-options">
                    <h3>{username}</h3>
                    <img src={Profile} />
                </div>
                <ReactTooltip
                    id="mobile-sidebar"
                    ref={tooltipRef1}
                    place="top"
                    className={cn(styles.tooltip, styles.onlyLittleScreen)}
                    clickable={true}
                    noArrow={true}
                    offset={-100}
                    opacity={1}
                    delayHide={200}
                    disableStyleInjection={true}
                    openEvents={{ ['click']: true }}
                    closeEvents={{ ['click']: true }}
                >
                    <div className={styles.row}><a href={ORDER_PAGE}><h3>Оформить заявку</h3></a></div>
                    <div className={styles.row}><a href={ORDERS_PAGE}><h3>История заявок</h3></a></div>
                    <div className={cn(styles.sectionContainer, dropdownState ? styles.show : styles.hide)}>
                        <h3 className={styles.support} onClick={handleChangeDropdownState}>
                            Поддержка
                            <img src={List_arrow} />
                        </h3>
                        <div className={cn(styles.dropdownContent, dropdownState ? styles.show : styles.hide)}>
                            <h3 className={styles.littleRow} onClick={handleEMailClick}>
                                <img src={Support} />
                                <div>{poputchik_email}</div>
                            </h3>
                        </div>
                    </div>

                    <div className={cn(styles.sectionContainer)}>
                        <div className={cn(styles.profile)} >
                            <h3>{username}</h3>
                        </div>
                        <div>
                            {localStorage.getItem('admin') == undefined &&
                                <Button buttonTheme={ButtonThemes.RED} className={cn(styles.littleRow, styles.redText)} onClick={handleGoToProfilePageClick}>
                                    <img src={Profile} />
                                    Личный кабинет
                                </Button>}
                            <Button buttonTheme={ButtonThemes.RED} className={cn(styles.littleRow, styles.redText)} onClick={handleExitClick}>
                                <img src={Exit} />
                                Выйти из аккаунта
                            </Button>
                        </div>
                    </div>

                </ReactTooltip>
                <Button buttonTheme={ButtonThemes.RED} className={cn(styles.burger, styles.onlyLittleScreen)} data-tooltip-id="mobile-sidebar"
                    onClick={() => { if (tooltipRef1.current?.isOpen) tooltipRef1.current?.close() }}
                >
                    <img src={Burger} />
                </Button>

            </div>
        </div>
    );
};

export default Header;
