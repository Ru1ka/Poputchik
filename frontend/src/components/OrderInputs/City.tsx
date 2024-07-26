import React, { useState, useEffect } from 'react';

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
  const [inputValue, setInputValue] = useState<string>(value);

  useEffect(() => {
    const extractedData = jsonDataCities.map((city: { city: string }) => city.city);
    setDataList(extractedData);
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

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
    const newValue = capitalizeAfterSpace(event.target.value);
    setInputValue(newValue);
    onChange(newValue);
  };

  const clearInput = () => {
    setInputValue('');
    onChange('');
  };

  return (
    <div className={city_styles.container}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <input 
          list="city-list"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Населённый пункт"
          className={input_styles.input}
        />
        {inputValue && (
          <img
            src={icon_clear} 
            onClick={clearInput} 
            style={{ position: 'absolute', right: '10px', top: '15px', cursor: 'pointer' }}
            className={icon_styles.clear_icon}
          />
        )}
        {!inputValue && (
          <img
            src={icon_search}
            style={{ position: 'absolute', right: '13px', top: '17px' }}
            className={icon_styles.input_icon}
          />
        )}
        <datalist 
          id="city-list"
          className={input_styles.datalist}>
          {dataList.map((city, index) => (
            <option key={index} value={city} />
          ))}
        </datalist>
      </div>
    </div>
  );
}

export default City;
