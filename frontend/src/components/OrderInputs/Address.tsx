import React from 'react'

import icon_styles from "../../icon_styles.module.css"
import input_styles from "../../UI/Input/Input.module.css"
import address_styles from "./Address.module.css"

import icon_clear from "../../assets/icons/clearIcon.svg"

interface AddressProps {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: string;
    onClear: () => void;
}

const Address: React.FC<AddressProps> = ({ id, value, onChange, onClear }) => {
  return (
    <div className={address_styles.address_input}>
      <input
        id={id}
        value={value}
        onChange={onChange}
        className={input_styles.input}
        placeholder='Адрес'
      />
      {value && <button onClick={onClear}><img
            src={icon_clear} 
            onClick={onClear} 
            style={{ position: 'absolute', right: '10px', top: '15px', cursor: 'pointer' }}
            className={icon_styles.clear_icon}
          /></button>}
    </div>
  );
};

export default Address;
