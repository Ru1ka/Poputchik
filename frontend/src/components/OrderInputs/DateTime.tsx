import icon from "../../assets/icons/Time.svg";
import { ChangeEvent } from "react";
import styles from "../../UI/Input/Input.module.css";
import dateTimeStyles from "./DateTime.module.css";
import icon_styles from "../../icon_styles.module.css";

interface DateTimeInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ value, onChange }) => {
  const isValidTimeChar = (char: string, index: number): boolean => {
    const num = parseInt(char);
    if (isNaN(num)) return false;

    switch(index) {
      case 0: return num <= 2;
      case 1: {
        const firstNum = parseInt(value[0]);
        if (firstNum === 1) {
          return num <= 9; // Allow 0-9 if the first digit is 1
        } else if (firstNum === 0) {
          return num <= 9; // Allow 0-9 if the first digit is 0
        } else if (firstNum === 2) {
          return num <= 3; // Allow 0-3 if the first digit is 2
        } else {
          return false;
        }
      }
      case 2: return num <= 5;
      case 3: return num <= 9;
      default: return false;
    }
  };

  const formatValue = (input: string): string => {
    let formatted = input.replace(/[^\d]/g, '');

    for (let i = 0; i < formatted.length; i++) {
      if (!isValidTimeChar(formatted[i], i)) {
        return value;
      }
    }

    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + ':' + formatted.slice(2);
    }

    return formatted;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatValue(inputValue);
    onChange({ ...e, target: { ...e.target, value: formattedValue } });
  };

  return (
    <div className={dateTimeStyles.container}>
      <img src={icon} className={icon_styles.add_order_icon} />
      <input 
        type="text" 
        placeholder="00:00"
        value={value}
        onChange={handleChange}
        className={styles.date_time}
        maxLength={5}
      />
    </div>
  );
}

export default DateTimeInput;
