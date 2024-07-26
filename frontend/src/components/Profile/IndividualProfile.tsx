import Input from "../../UI/Input/Input";
import styles from "./Profile.module.css";
import { InputThemes } from "../../UI/Input/InputTypes";
import { UserInfo } from "./Profile"
import CustomPhoneInput from "../../UI/Input/CustomPhoneInput";

const IndividualProfile = (props: { userInfo: UserInfo, handleInputChange: (name: string, value: any) => void }) => {
    return (
        <div className={styles.inputWrapper}>
            <div className={styles.inputContainer}>
                <h3>Название организации</h3>
                <Input
                    inputTheme={InputThemes.RED}
                    value={props.userInfo.organization}
                    name="organization"
                    onChange={(e: any) => { props.handleInputChange('organization', e.target.value) }} />
            </div>
            <div className={styles.inputContainer}>
                <h3>ИНН организации</h3>
                <Input
                    inputTheme={InputThemes.RED}
                    value={props.userInfo.inn}
                    name="inn"
                    onChange={(e: any) => { props.handleInputChange('inn', e.target.value) }} />
            </div>
            <div className={styles.inputContainer}>
                <h3>Номер телефона</h3>
                <CustomPhoneInput
                    value={''}
                    phone={props.userInfo.phone}
                    onChange={(phone: string) => { props.handleInputChange('phone', phone)}} />
            </div>
            <div className={styles.inputContainer}>
                <h3>Почта</h3>
                <Input
                    inputTheme={InputThemes.RED}
                    value={props.userInfo.email}
                    name="email"
                    onChange={(e: any) => { props.handleInputChange('email', e.target.value) }} />
            </div>
        </div>
    );
};

export default IndividualProfile;