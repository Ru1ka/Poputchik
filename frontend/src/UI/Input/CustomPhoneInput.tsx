import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styles from "./CustomPhoneInput.module.css";
import { buttonStyle, containerStyle, inputStyle } from './PhoneInputStyling';

const CustomPhoneInput = (props: { phone: string, onChange: (value: string) => void, autoFocus? : boolean, value: string }) => {
    return (
        <PhoneInput
            inputClass={styles.phone_input}
            country={'ru'}
            onlyCountries={['ru']}
            disableDropdown
            disableSearchIcon={true}
            countryCodeEditable={false}
            value={props.phone}
            placeholder={"+7 (999) 999-99-99"}
            // onChange={(phone: string) => { props.handleInputChange('phone', phone) }}
            onChange={props.onChange}
            containerStyle={containerStyle}
            buttonStyle={buttonStyle}
            inputStyle={inputStyle}
            inputProps={{
                name: 'phone',
                required: true,
                autoFocus: props.autoFocus,
            }} />
    );
};

export default CustomPhoneInput;