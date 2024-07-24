import styles from "./ProfilePage.module.css";
import Header from "../../components/Header/Header";
import Profile, { UserInfo } from "../../components/Profile/Profile";
import { useEffect, useState } from "react";
import fetchGetUserProfile from "../../fetch_functions/fetchGetUserProfile";

export interface ProfileResponse {
    id: number,
    name: string,
    is_organization_account: boolean,
    email: string,
    organization: null | {
        id: number,
        organization_name: string,
        inn: number,
    },
    inn: string,
    phone: string,
}

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState<UserInfo>(
        {
            id: 0,
            name: '',
            is_organization_account: false,
            email: '',
            organization: '',
            inn: '',
            phone: '',
        }
    )

    const handleInputChange = (name: string, value: any) => {
        setUserInfo({ ...userInfo, [name]: value });
    };

    useEffect(() => {
        if (localStorage.getItem('token') !== '') {
            fetchGetUserProfile()
                .then((data: ProfileResponse) => {
                    console.log(data);

                    setUserInfo({
                        id: data.id,
                        name: data.name,
                        is_organization_account: data.is_organization_account,
                        email: data.email == null ? '' : data.email,
                        organization: data.organization ? data.organization.organization_name?.toString() : '',
                        inn: data.organization ? data.organization.inn.toString() : '',
                        phone: data.phone,
                    });
                })
        }
    }, [])

    return (
        <div className={styles.page}>
            <Header />
            <Profile userInfo={userInfo} handleInputChange={handleInputChange} />
        </div>
    );
};

export default ProfilePage;
