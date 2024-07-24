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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue); // Pass the new value to the parent component
  };

  const clearInput = () => {
    setInputValue('');
    onChange(''); // Clear the value in the parent component as well
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
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
            className={icon_styles.clear_icon}
          />
        )}
        {!inputValue && (
          <img
            src={icon_search}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
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
