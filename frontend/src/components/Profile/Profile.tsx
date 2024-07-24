import styles from "./Profile.module.css";
import container_styles from '../../UI/containers.module.css';
import cn from "classnames";
import ProfilePic from '../../assets/icons/Profile.svg';
import IndividualProfile from "./IndividualProfile";
import PhysicalProfile from "./PhysicalProfile";
import Button from "../../UI/Button/Button";
import { ButtonThemes } from "../../UI/Button/ButtonTypes";
import fetchPutUserProfile from "../../fetch_functions/fetchPutUserProfile";

export interface UserInfo {
    id: number,
    email: string,
    phone: string,
    is_organization_account: boolean,
    organization: string,
    inn: string,
    name: string,
}

const Profile = (props: { userInfo: UserInfo, handleInputChange: (name: string, value: any) => void }) => {
    function submitProfileFormHandler() {
        fetchPutUserProfile(props.userInfo);
    }

    return (
        <div className={styles.centeredFrame}>
            <div className={cn(container_styles.flex_row, container_styles.gap_10)} style={{ width: 300 }}>
                <img className={styles.basicIcon} src={ProfilePic}></img>
                <h2>Личный кабинет</h2>
            </div>
            {props.userInfo.is_organization_account ?
                <IndividualProfile userInfo={props.userInfo} handleInputChange={props.handleInputChange} />
                : <PhysicalProfile
                    userInfo={props.userInfo}
                    handleInputChange={
                        (name: string, value: any) => {
                            props.handleInputChange(name, value);
                        }
                    } />}
            <Button buttonTheme={ButtonThemes.RED_FILLED} onClick={submitProfileFormHandler}>
                Сохранить изменения
            </Button>
        </div>
    );
};

export default Profile;