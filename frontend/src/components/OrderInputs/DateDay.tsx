import icon from "../../assets/icons/Calendar.svg"
import { ChangeEvent } from "react";
import styles from "../../UI/Input/Input.module.css"
import dateDayStyles from "./DateDay.module.css"
import icon_styles from "../../icon_styles.module.css"

interface DateDayInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const DateDayInput: React.FC<DateDayInputProps> = ({ value, onChange }) => {

  const isValidDateChar = (char: string, index: number, currentValue: string): boolean => {
    const num = parseInt(char);
    if (isNaN(num)) return false;

    switch (index) {
      case 0: return num >= 0 && num <= 3;
      case 1: {
        const firstDay = parseInt(currentValue[0]);
        if (firstDay === 3) {
          return num >= 0 && num <= 1;
        } else if (firstDay === 0) {
          return num >= 1 && num <= 9;
        } else {
          return num >= 0 && num <= 9;
        }
      }
      case 2: return num >= 0 && num <= 1;
      case 3: {
        const firstMonth = parseInt(currentValue[2]);
        if (firstMonth === 1) {
          return num >= 0 && num <= 2;
        } else {
          return num >= 1 && num <= 9;
        }
      }
      case 4: return num === 2;
      case 5: return num === 0;
      case 6: return num === 2;
      case 7: return num >= 4 && num <= 5;
      default:
        return true;
    }
  };

  const isValidDate = (day: number, month: number): boolean => {
    if (month < 1 || month > 12) return false;

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && day > 28) return false;

    return day >= 1 && day <= daysInMonth[month - 1];
  };

  const formatValue = (input: string): string => {
    let formatted = input.replace(/[^\d]/g, '');

    for (let i = 0; i < formatted.length; i++) {
      if (!isValidDateChar(formatted[i], i, formatted)) {
        return value;
      }
    }

    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + '.' + formatted.slice(2);
    }
    if (formatted.length > 5) {
      formatted = formatted.slice(0, 5) + '.' + formatted.slice(5);
    }

    if (formatted.length === 10) {
      const day = parseInt(formatted.slice(0, 2));
      const month = parseInt(formatted.slice(3, 5));

      if (!isValidDate(day, month)) {
        return value;
      }
    }

    return formatted;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatValue(inputValue);
    onChange({ ...e, target: { ...e.target, value: formattedValue } });
  };

  return (
    <div className={dateDayStyles.container}>
      <img src={icon} className={icon_styles.add_order_icon}/>
      <input
        type="text"
        placeholder="00.00.0000"
        value={value}
        onChange={handleChange}
        className={styles.date_day}
        maxLength={10}
      />
    </div>
  );
}

export default DateDayInput;