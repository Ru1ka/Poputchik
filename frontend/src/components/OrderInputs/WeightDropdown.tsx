import { useEffect, useRef, useState } from "react";
import { OptionType } from "./WeightAndVATDropdownTypes";
import weight_styles from "./WeightDropdown.module.css";
import styles from "../../UI/Input/Input.module.css";
import icon from "../../assets/icons/more_arrow.svg";

interface IDropdown {
  initialValue?: OptionType;
  options: OptionType[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  icon?: string;
  value?: string;
  onChange: (value: string) => void;
  id?: string;
  width?: string;
}

const Dropdown = ({
  placeholder,
  disabled,
  initialValue,
  options,
  id,
  onChange,
  value,
  width
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
    onChange(option.value);
  };

  return (
    <div ref={ref} className={weight_styles.weight_type_input} style={{ width }}>
      <button
        role="combobox"
        aria-expanded={dropdown ? dropdown : false}
        aria-label={selected ? selected.label : placeholder}
        disabled={disabled}
        id={id}
        ref={buttonRef}
        onClick={handleClick}
        className={styles.weight_type_input}
      >
        <div>
          <p>{selected ? selected.label : placeholder}</p>
        </div>
        <img src={icon} alt="dropdown icon" />
      </button>

      {dropdown && (
        <ul
          ref={ulRef}
          role="listbox"
          className={weight_styles.weight_dropdown}
        >
          {options &&
            options.map((option: OptionType) => (
              <li
                role="option"
                aria-selected={selected === option}
                key={option.label}
                aria-label={option.label}
                className={weight_styles.weight_li}
                onClick={() => handleItemClick(option)}
              >
                {option.label}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;