import { useEffect, useRef, useState } from "react";
import { OptionType } from "./WeightAndVATDropdownTypes";
import vat_styles from "./VATDropdown.module.css";
import styles from "../../UI/Input/Input.module.css";
import icon_styles from "../../icon_styles.module.css";
import icon from "../../assets/icons/Rub.svg";
import iconMoreArrow from "../../assets/icons/more_arrow.svg";

interface IDropdown {
  initialValue?: OptionType;
  options: OptionType[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  icon?: string;
  value?: string; // Добавлено
  onChange?: (value: string) => void; // Добавлено
  id?: string;
}

const VATDropdown = ({
  placeholder,
  disabled,
  initialValue,
  options,
  value, // Добавлено
  onChange, // Добавлено
  id,
}: IDropdown) => {
  const [dropdown, setDropdown] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<OptionType | null>(
    initialValue || null
  );

  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdown((prev) => (prev ? false : null));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const selectedOption = options.find(option => option.value === value);
      setSelected(selectedOption || null);
    }
  }, [value, options]);

  const handleClick = () => {
    setDropdown(!dropdown);
  };

  const handleItemClick = (option: OptionType) => {
    setSelected(option);
    setDropdown(!dropdown);
    if (onChange) {
      onChange(option.value);
    }
  };

  return (
    <div className={vat_styles.container}>
      <img src={icon} className={icon_styles.add_order_icon} />
      <div ref={ref} className={vat_styles.vat_type_input}>
        <button
          role="combobox"
          aria-expanded={dropdown ? dropdown : false}
          aria-label={selected ? selected.label : placeholder}
          disabled={disabled}
          id={id}
          ref={buttonRef}
          onClick={() => handleClick()}
          className={styles.weight_amount_vat_input}
        >
          <div>
            <p>{selected ? selected.label : placeholder}</p>
          </div>
          <img src={iconMoreArrow} />
        </button>

        {dropdown && (
          <ul ref={ulRef} role="listbox" className={vat_styles.vat_dropdown}>
            {options &&
              options.map((option: OptionType) => (
                <li
                  role="option"
                  aria-selected={selected === option}
                  key={option.label}
                  aria-label={option.label}
                  className={vat_styles.vat_li}
                  onClick={() => handleItemClick(option)}
                >
                  {option.label}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VATDropdown;
