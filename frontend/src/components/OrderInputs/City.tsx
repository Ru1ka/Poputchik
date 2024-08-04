import React, { useState, useEffect, useRef } from 'react';
import icon_styles from "../../icon_styles.module.css";
import input_styles from "../../UI/Input/Input.module.css";
import city_styles from "./City.module.css";

import icon_search from "../../assets/icons/InputFind.svg";
import icon_clear from "../../assets/icons/clearIcon.svg";

import jsonDataCities from './cities.json';

interface CityProps {
  value: string;
  onChange: (value: string) => void;
}

const City: React.FC<CityProps> = ({ value, onChange }) => {
  const [dataList, setDataList] = useState<string[]>([]);
  const [filteredDataList, setFilteredDataList] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const extractedData = jsonDataCities.map((city: { city: string }) => city.city);
    setDataList(extractedData);
    setFilteredDataList(extractedData);
  }, []);

  const capitalizeAfterSpace = (value: string) => {
    return value
      .split(' ')
      .map(part =>
        part
          .split('-')
          .map((subPart, index) =>
            index === 0
              ? subPart.charAt(0).toUpperCase() + subPart.slice(1).toLowerCase()
              : subPart.charAt(0) + subPart.slice(1).toLowerCase()
          )
          .join('-')
      )
      .join(' ');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const filteredValue = newValue.replace(/[^a-zA-Zа-яА-Я\s-]/g, '');
    const capitalizedValue = capitalizeAfterSpace(filteredValue);
    onChange(capitalizedValue);

    const filteredList = dataList.filter(item => 
      item.toLowerCase().includes(capitalizedValue.toLowerCase())
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
    <div className={city_styles.container}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <input 
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          placeholder="Населённый пункт"
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
          <div className={city_styles.dropdown}>
            {filteredDataList.map((item, index) => (
              <div 
                key={index}
                className={city_styles.dropdown_item}
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

export default City;
