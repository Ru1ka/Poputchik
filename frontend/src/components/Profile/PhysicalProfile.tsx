import Input from "../../UI/Input/Input";
import styles from "./Profile.module.css";
import { InputThemes } from "../../UI/Input/InputTypes";
import { UserInfo } from "./Profile";
import CustomPhoneInput from "../../UI/Input/CustomPhoneInput";


const PhysicalProfile = (props: { userInfo: UserInfo, handleInputChange: (name: string, value: any) => void }) => {
    return (
        <div className={styles.inputWrapper}>
            <div className={styles.inputContainer}>
                <h3>Имя</h3>
                <Input
                    inputTheme={InputThemes.RED}
                    value={props.userInfo.name}
                    name="name"
                    style={{ textTransform: 'capitalize' }}
                    onChange={(e: any) => { props.handleInputChange('name', e.target.value) }} />
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
                    isValid={false}
                    errorMessage=""
                    name="email"
                    onChange={(e: any) => { props.handleInputChange('email', e.target.value) }} />
            </div>
        </div>
    );
};

export default PhysicalProfile;