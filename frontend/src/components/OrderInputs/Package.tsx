import { useState, useEffect, useRef } from 'react';
import icon_styles from "../../icon_styles.module.css";
import input_styles from "../../UI/Input/Input.module.css";
import cargo_styles from "./Cargo.module.css";

import icon_search from "../../assets/icons/InputFind.svg";
import icon_clear from "../../assets/icons/clearIcon.svg";

import jsonData from './package_type.json';

interface PackageProps {
  value: string;
  onChange: (value: string) => void;
}

function Package({ value, onChange }: PackageProps) {
  const [dataList, setDataList] = useState<string[]>([]);
  const [filteredDataList, setFilteredDataList] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const extractedData = jsonData.map((item: { name: string }) => item.name);
    setDataList(extractedData);
    setFilteredDataList(extractedData);
  }, []);

  const capitalizeFirstLetter = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = capitalizeFirstLetter(event.target.value);
    onChange(newValue);

    const filteredList = dataList.filter(item => 
      item.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredDataList(filteredList);
    setIsDropdownVisible(true);
  };

  const clearInput = () => {
    onChange('');
    setFilteredDataList(dataList);
    setIsDropdownVisible(false);
  };

  const handleItemClick = (item: string) => {
    onChange(item);
    setIsDropdownVisible(false);
  };

  return (
    <div className={cargo_styles.container}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          placeholder="Упаковка"
          className={input_styles.input}
          onFocus={() => setIsDropdownVisible(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsDropdownVisible(false);
            }, 100);
          }}
        />
        {value && (
          <img
            src={icon_clear}
            onClick={clearInput}
            style={{ position: 'absolute', right: '10px', top: '15px', cursor: 'pointer' }}
            className={icon_styles.clear_icon}
          />
        )}
        {!value && (
          <img
            src={icon_search}
            style={{ position: 'absolute', right: '13px', top: '17px' }}
            className={icon_styles.input_icon}
          />
        )}
        {isDropdownVisible && (
          <div className={cargo_styles.dropdown}>
            {filteredDataList.map((item, index) => (
              <div 
                key={index}
                className={cargo_styles.dropdown_item}
                onMouseDown={() => handleItemClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Package;
