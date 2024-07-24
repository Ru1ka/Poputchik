import { ChangeEvent, FC } from 'react';
import icon from "../../assets/icons/Volume.svg";
import styles from "../../UI/Input/Input.module.css";
import amount_styles from "./Amount.module.css";
import icon_styles from "../../icon_styles.module.css";

interface AmountProps {
  value: string;
  onChange: (value: string) => void;
}

const Amount: FC<AmountProps> = ({ value, onChange }) => {
  const isValidDateChar = (char: string): boolean => {
    const num = parseInt(char);
    return !isNaN(num);
  };

  const formatValue = (input: string): string => {
    const formatted = input.replace(/[^\d]/g, '');

    for (let i = 0; i < formatted.length; i++) {
      if (!isValidDateChar(formatted[i])) {
        return value;
      }
    }

    return formatted;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatValue(inputValue);
    onChange(formattedValue);
  };

  return (
    <div className={amount_styles.container}>
      <img src={icon} alt='Объём' className={icon_styles.add_order_icon} />
      <label className={styles.weight_amount_vat_input}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          maxLength={4}
          placeholder='Объём'
          className={amount_styles.input}
        />
        <span className={amount_styles.amount_value}>м<sup>3</sup></span>
      </label>
    </div>
  );
}

export default Amount;