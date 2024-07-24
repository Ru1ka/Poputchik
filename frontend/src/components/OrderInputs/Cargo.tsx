import { useState, useEffect } from 'react';

import icon_styles from "../../icon_styles.module.css"
import input_styles from "../../UI/Input/Input.module.css"
import cargo_styles from "./Cargo.module.css"

import icon from "../../assets/icons/Cargo.svg"
import icon_search from "../../assets/icons/InputFind.svg"
import icon_clear from "../../assets/icons/clearIcon.svg"

import jsonData from './cargo.json';

interface CargoProps{
  value: string;
  onChange: (value: string) => void;
}

function Cargo({ value, onChange }: CargoProps) {
  const [dataList, setDataList] = useState<string[]>([]);

  useEffect(() => {
    const extractedData = jsonData.map((item: { name: string }) => item.name);
    setDataList(extractedData);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const clearInput = () => {
    onChange('');
  };

  return (
    <div className={cargo_styles.container}>
      <img src={icon} alt="Груз" className={icon_styles.add_order_icon}/>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <input 
          list="cargo-list"
          value={value}
          onChange={handleInputChange}
          placeholder="Груз"
          className={input_styles.input}
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
            style={{ position: 'absolute', right: '10px', top: '15px' }}
            className={icon_styles.input_icon}
          />
        )}
        <datalist id="cargo-list">
          {dataList.map((item, index) => (
            <option key={index} value={item} />
          ))}
        </datalist>
      </div>
    </div>
  );
}

export default Cargo;