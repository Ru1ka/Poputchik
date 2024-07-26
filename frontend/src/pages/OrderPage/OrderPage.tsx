import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import cn from 'classnames';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import DateDayInput from '../../components/OrderInputs/DateDay';
import DateTimeInput from '../../components/OrderInputs/DateTime';
import Dropdown from '../../components/OrderInputs/WeightDropdown';
import Amount from '../../components/OrderInputs/Amount';
import VATDropdown from '../../components/OrderInputs/VATDropdown';
import Cargo from '../../components/OrderInputs/Cargo';
import City from '../../components/OrderInputs/City';
import Address from '../../components/OrderInputs/Address';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import CustomPhoneInput from '../../UI/Input/CustomPhoneInput';
import Header from '../../components/Header/Header';

import fetchGetDistance from '../../fetch_functions/fetchGetDistance';
import fetchCreateOrder from '../../fetch_functions/fetchCreateOrder';
import fetchUpdateOrder from '../../fetch_functions/fetchUpdateOrder';

import cargo_icon from '../../assets/icons/Cargo.svg';
import weight_icon from '../../assets/icons/Weight.svg';
import amount_icon from '../../assets/icons/Volume.svg';
import point_icon from '../../assets/icons/Point.svg';
import phone_icon from '../../assets/icons/Phone.svg';
import temp_icon from '../../assets/icons/Temp_regime.svg';
import calendar_icon from '../../assets/icons/Calendar.svg';
import path_icon from '../../assets/icons/Path.svg';
import add_icon from '../../assets/icons/addPointIcon.svg';
import clear_icon from '../../assets/icons/clearIcon.svg';
import icon from '../../assets/icons/Add_new_order.svg';

import styles from './OrderPage.module.css';
import icon_styles from '../../icon_styles.module.css';
import input_styles from '../../UI/Input/Input.module.css';
import button_styles from '../../UI/Button/Button.module.css';
import amount_styles from '../../components/OrderInputs/Amount.module.css';
import container_styles from '../../UI/containers.module.css';

import { ButtonThemes } from '../../UI/Button/ButtonTypes';
import { InputThemes } from '../../UI/Input/InputTypes';

import Order from '../../components/Orders/OrderModel';
import { ModalContext } from '../../components/Modal/ModalContext';
import { ORDERS_PAGE } from '../../router/paths';

dayjs.extend(customParseFormat);

type AdditionalBlock = {
  city: string;
  address: string;
  phone: string;
};

export default function OrderPage() {
  const [cargoValue, setCargoValue] = useState<string>('');
  const [amountValue, setAmountValue] = useState<number | null>(null);
  const [onLoadingPhoneValue, setLoadingPhoneValue] = useState<string>('');
  const [onUnloadingPhoneValue, setOnUnloadingPhoneValue] = useState<string>('');
  const [onLoadingValue, setOnLoadingValue] = useState<string>('');
  const [onUnloadingValue, setOnUnloadingValue] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('кг');
  const [onLoadingCityValue, setOnLoadingCityValue] = useState<string>('');
  const [onUnloadingCityValue, setUnloadingCityValue] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [weightValue, setWeightValue] = useState<number | null>(null);
  const [distanceValue, setDistanceValue] = useState<number | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [vatValue, setVatValue] = useState<string>('с НДС');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [additionalBlocks, setAdditionalBlocks] = useState<AdditionalBlock[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode || 'create';

  const { openModal } = useContext(ModalContext);

  useEffect(() => {
    console.log('a')
    if (localStorage.getItem('token') == undefined) {
      openModal();
      console.log('b')
    }
  }, [])

  useEffect(() => {
    if (mode === 'edit' || mode === 'repeat') {
      const order: Order = location.state.order;

      setCargoValue(order.cargo);
      setAmountValue(order.amount);
      setLoadingPhoneValue(order.loading_points[0].phone);
      setOnUnloadingPhoneValue(order.unloading_points[0].phone);
      setOnLoadingValue(order.loading_points[0].address);
      setOnUnloadingValue(order.unloading_points[0].address);
      setSelectedUnit(order.weight > 1000 ? 'т' : 'кг');
      setWeightValue(order.weight > 1000 ? order.weight / 1000 : order.weight);
      setOnLoadingCityValue(order.loading_points[0].locality);
      setUnloadingCityValue(order.unloading_points[0].locality);
      setDate(dayjs(order.loading_time).format('DD.MM.YYYY'));
      setTime(dayjs(order.loading_time).format('HH:mm'));
      setDistanceValue(Math.floor(order.distance / 1000));
      setVatValue(order.VAT ? 'с НДС' : 'без НДС');
      setIsChecked(order.temperature_condition);
      setPrice(order.cost);

      setAdditionalBlocks(order.loading_points.slice(1).map(point => ({
        city: point.locality,
        address: point.address,
        phone: point.phone,
      })));
    }
  }, [location.state, mode]);

  const fetchDistance = async () => {
    if (onLoadingCityValue && onLoadingValue && onUnloadingCityValue && onUnloadingValue) {
      try {
        const distanceData = await fetchGetDistance(
          onLoadingCityValue, onLoadingValue, onLoadingPhoneValue,
          onUnloadingCityValue, onUnloadingValue, onUnloadingPhoneValue
        );

        console.log('Distance data:', distanceData);
        setDistanceValue(Math.floor(distanceData.distance / 1000));
        return distanceData;
      } catch (error) {
        console.error('Ошибка при расчете расстояния:', error);
        setDistanceValue(0);
        return null;
      }
    }
    return null;
  };

  const capitalizeFirstLetter = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

  const handleLoadingCityChange = (value: string) => {
    setOnLoadingCityValue(capitalizeFirstLetter(value));
  };

  const handleLoadingValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOnLoadingValue(e.target.value);
  };

  const handleUnloadingCityChange = (value: string) => {
    setUnloadingCityValue(capitalizeFirstLetter(value));
  };

  const handleUnloadingValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOnUnloadingValue(e.target.value);
  };

  const handleLoadingPhoneChange = (phone: string) => {
    setLoadingPhoneValue(phone);
  };

  const handleUnloadingPhoneChange = (phone: string) => {
    setOnUnloadingPhoneValue(phone);
  };

  const fetchOrderDetailsCallback = useCallback(async (distance: number | null) => {
    if (onLoadingCityValue && onLoadingValue && onUnloadingCityValue && onUnloadingValue) {
      try {
        const isoDateString = getISODateString(date, time);
        const adjustedWeight = selectedUnit === 'т' ? weightValue! * 1000 : weightValue!;
        const readableWeight = `${weightValue} ${selectedUnit}`;
        const additionalLoadingPoints = additionalBlocks.map(block => ({
          locality: block.city,
          address: block.address,
          phone: block.phone,
        }));

        if (mode === 'create' || mode === 'repeat') {
          const orderDetails = await fetchCreateOrder(
            cargoValue, price, adjustedWeight, amountValue!, isoDateString,
            onLoadingCityValue, onLoadingValue, onLoadingPhoneValue,
            onUnloadingCityValue, onUnloadingValue, onUnloadingPhoneValue,
            isChecked, distance!, additionalLoadingPoints, vatValue === 'с НДС', readableWeight
          );
          return orderDetails;
        } else {
          const id = location.state?.order?.id ?? 0;
          const statusValue = location.state?.order?.status ?? 'new';

          const orderDetails = await fetchUpdateOrder(
            id, cargoValue, price, adjustedWeight, amountValue!, isoDateString,
            onLoadingCityValue, onLoadingValue, onLoadingPhoneValue,
            onUnloadingCityValue, onUnloadingValue, onUnloadingPhoneValue,
            isChecked, statusValue, distance!, additionalLoadingPoints, vatValue === 'с НДС', readableWeight
          );
          return orderDetails;
        }
      } catch (error) {
        console.error('Ошибка при получении данных о заказе:', error);
        return null;
      }
    }
    return null;
  }, [
    cargoValue, weightValue, amountValue, date, price, time,
    onLoadingCityValue, onLoadingValue, onLoadingPhoneValue,
    onUnloadingCityValue, onUnloadingValue, onUnloadingPhoneValue, isChecked, selectedUnit, location.state, mode, additionalBlocks, vatValue
  ]);

  const getISODateString = (date: string, time: string) => {
    try {
      const dateTimeString = `${date} ${time}`;
      const dateTime = dayjs(dateTimeString, 'DD.MM.YYYY HH:mm');

      if (!dateTime.isValid()) {
        throw new Error('Invalid date or time format');
      }

      const localDate = dateTime.toDate();
      const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
      const isoString = utcDate.toISOString();
      return isoString;
    } catch (error) {
      console.error('Invalid date or time value:', error);
      return '';
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleDropdownChange = (value: string) => {
    setSelectedUnit(value);
  };

  const handleAmountChange = (value: string) => {
    if (value === '') {
      setAmountValue(null);
    } else {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        setAmountValue(numericValue);
      }
    }
  };

  const handleVATChange = (value: string) => {
    setVatValue(value === 'с НДС' ? 'с НДС' : 'без НДС');
  };

  const formatOutput = () => {
    if (date && time) {
      return `${date}, ${time}`;
    }
    return date || time || 'Нет данных';
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const setWeightNumberValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setWeightValue(null);
    } else {
      const numericValue = parseFloat(e.target.value);
      if (!isNaN(numericValue)) {
        setWeightValue(numericValue);
      }
    }
  };

  const clearLoadingInput = () => {
    setOnLoadingValue('');
  };

  const clearUnloadingInput = () => {
    setOnUnloadingValue('');
  };

  const isDateAndTimeComplete = () => date.length === 10 && time.length === 5;

  const isPhoneNumberValid = (phone: string) => phone.length >= 11;

  useEffect(() => {
    const checkInputs = () => {
      return cargoValue && weightValue !== null && selectedUnit && amountValue !== null && date.length === 10 && time.length === 5 &&
        onLoadingCityValue && onLoadingValue && isPhoneNumberValid(onLoadingPhoneValue) &&
        onUnloadingCityValue && onUnloadingValue && isPhoneNumberValid(onUnloadingPhoneValue) && vatValue !== null;
    };

    const checkPreview = () => {
      return cargoValue || weightValue !== null || selectedUnit || amountValue !== null || date || time ||
        onLoadingCityValue || onLoadingValue || onLoadingPhoneValue ||
        onUnloadingCityValue || onUnloadingValue || onUnloadingPhoneValue || distanceValue !== null;
    };

    const shouldDisableButton = !checkInputs() || !checkPreview();
    setIsButtonDisabled(shouldDisableButton);
  }, [cargoValue, weightValue, selectedUnit, amountValue, date, time, onLoadingCityValue, onLoadingValue, onLoadingPhoneValue, onUnloadingCityValue, onUnloadingValue, onUnloadingPhoneValue, distanceValue, vatValue]);

  const handleOrderSubmit = async () => {
    if (!isButtonDisabled) {
      const distanceData = await fetchDistance();
      const orderDetails = await fetchOrderDetailsCallback(distanceData?.distance ?? null);
      if (orderDetails) {
        navigate(ORDERS_PAGE, { state: { newOrder: orderDetails } });
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!isButtonDisabled) {
      const distanceData = await fetchDistance();
      const orderDetails = await fetchOrderDetailsCallback(distanceData?.distance ?? null);
      if (orderDetails) {
        navigate(ORDERS_PAGE, { state: { updatedOrder: orderDetails } });
      }
    }
  };

  const handleAddBlock = () => {
    setAdditionalBlocks([...additionalBlocks, { city: '', address: '', phone: '' }]);
  };

  const handleRemoveBlock = (index: number) => {
    setAdditionalBlocks(additionalBlocks.filter((_, i) => i !== index));
  };

  const handleBlockChange = (index: number, field: keyof AdditionalBlock, value: string) => {
    const updatedBlocks = [...additionalBlocks];
    updatedBlocks[index][field] = field === 'city' ? capitalizeFirstLetter(value) : value;
    setAdditionalBlocks(updatedBlocks);
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.order_page}>
        <div className={styles.order_block}>
          <div className={styles.order_title}>
            <img src={icon} className={icon_styles.title_icon} />
            <h2>{mode === 'edit' ? 'Редактировать заявку' : mode === 'repeat' ? 'Повторить заявку' : 'Оформить заявку'}</h2>
          </div>
          <div className={styles.order_main}>
            <div className={styles.order_cargo_block}>
              <Cargo
                value={cargoValue}
                onChange={setCargoValue}>
              </Cargo>
              <div className={styles.weight_group_input}>
                <div className={styles.weight_input}>
                  <img
                    src={weight_icon}
                    alt="Вес"
                    className={icon_styles.add_order_icon} />
                  <input
                    type="text"
                    value={weightValue !== null ? weightValue.toString() : ''}
                    onChange={setWeightNumberValue}
                    maxLength={4}
                    className={input_styles.weight_amount_vat_input}
                    placeholder='Вес'
                  />
                </div>
                <Dropdown
                  id="weight_type"
                  value={selectedUnit}
                  onChange={handleDropdownChange}
                  options={[
                    { label: 'кг', value: 'кг' },
                    { label: 'т', value: 'т' }
                  ]}
                />
              </div>
              <Amount
                value={amountValue !== null ? amountValue.toString() : ''}
                onChange={handleAmountChange}
              ></Amount>
            </div>

            <div className={cn(container_styles.flex_row, container_styles.gap_10)} style={{ alignItems: 'center' }}>
              <Input
                inputTheme={InputThemes.RED}
                autoFocus={false}
                checked={isChecked}
                onChange={handleCheckboxChange}
                name='terms'
                type='checkbox'
              />
              <div className={styles.order_temp_text}>
                Температурный режим
              </div>
            </div>

            <div className={styles.date_block}>
              <DateDayInput
                value={date}
                onChange={handleDateChange}
              ></DateDayInput>
              <DateTimeInput
                value={time}
                onChange={handleTimeChange}
              ></DateTimeInput>
            </div>

            <div className={styles.loading_block}>
              <p>Загрузка</p>
              <div className={styles.place_block}>
                <div className={styles.city_block}>
                  <img src={point_icon} alt='Населённый пункт' className={icon_styles.add_order_icon} />
                  <City
                    value={onLoadingCityValue}
                    onChange={handleLoadingCityChange} />
                </div>
                <Address
                  id='onLoadingInput'
                  value={onLoadingValue}
                  onChange={handleLoadingValueChange}
                  onClear={clearLoadingInput}
                />
              </div>
              <div className={styles.phone_block}>
                <img src={phone_icon} alt='Телефон' className={icon_styles.add_order_icon} />
                <div className={styles.phone_input}>
                  <CustomPhoneInput
                    value={onLoadingPhoneValue}
                    onChange={handleLoadingPhoneChange}
                    phone={onLoadingPhoneValue}
                  />
                </div>
              </div>
            </div>

            <div className={styles.add_point_button}>
              <img src={add_icon} className={icon_styles.add_order_icon} />
              <Button
                buttonTheme={ButtonThemes.BLACK}
                className={cn(button_styles.button, button_styles.button_width300px)}
                onClick={handleAddBlock}
              >
                Добавить точку погрузки/разгрузки
              </Button>
            </div>

            {additionalBlocks.map((block, index) => (
              <div key={index} className={styles.loading_block}>
                <div className={styles.place_block}>
                  <div className={styles.city_block}>
                    <img src={point_icon} alt='Населённый пункт' className={icon_styles.add_order_icon} />
                    <City
                      value={block.city}
                      onChange={(value) => handleBlockChange(index, 'city', value)} />
                  </div>
                  <Address
                    id={`loadingInput${index}`}
                    value={block.address}
                    onChange={(e) => handleBlockChange(index, 'address', e.target.value)}
                    onClear={() => handleBlockChange(index, 'address', '')}
                  />
                  <img 
                    src={clear_icon} 
                    alt='Удалить точку' 
                    className={cn(icon_styles.clear_icon, styles.remove_icon)} 
                    onClick={() => handleRemoveBlock(index)}
                  />
                </div>
                <div className={styles.phone_block}>
                  <img src={phone_icon} alt='Телефон' className={icon_styles.add_order_icon} />
                  <div className={styles.phone_input}>
                    <CustomPhoneInput
                      value={block.phone}
                      onChange={(phone) => handleBlockChange(index, 'phone', phone)}
                      phone={block.phone}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.loading_block}>
              <p>Разгрузка</p>
              <div className={styles.place_block}>
                <div className={styles.city_block}>
                  <img src={point_icon} alt='Населённый пункт' className={icon_styles.title_icon} />
                  <City
                    value={onUnloadingCityValue}
                    onChange={handleUnloadingCityChange} />
                </div>
                <Address
                  id='onUnloadingInput'
                  value={onUnloadingValue}
                  onChange={handleUnloadingValueChange}
                  onClear={clearUnloadingInput}
                />
              </div>
              <div className={styles.phone_block}>
                <img src={phone_icon} alt='Телефон' className={icon_styles.add_order_icon} />
                <div className={styles.phone_input}>
                  <CustomPhoneInput
                    value={onUnloadingPhoneValue}
                    onChange={handleUnloadingPhoneChange}
                    phone={onUnloadingPhoneValue}
                  />
                </div>
              </div>
            </div>
            <VATDropdown
              id='vat_type'
              value={vatValue}
              onChange={handleVATChange}
              options={[
                { label: 'с НДС', value: 'с НДС' },
                { label: 'без НДС', value: 'без НДС' }
              ]}
            />
          </div>
        </div>
        <div className={styles.order_preview_block}>
          <div className={styles.order_preview_group_elements}>

            <div className={styles.order_preview_element}>
              <div className={styles.order_preview_element_title}>
                <p>Груз</p>
              </div>
              <div className={styles.order_preview_element_info}>
                {cargoValue ? <img src={cargo_icon} className={icon_styles.title_icon}></img> : <img src={cargo_icon} className={icon_styles.preview_order_icon}></img>}
                <p style={{ color: cargoValue ? 'black' : 'var(--inactive-text-color)' }}>{cargoValue ? cargoValue : 'Нет данных'}</p>
                {isChecked && <img src={temp_icon} alt='Температурный режим' className={icon_styles.temp_icon} />}
              </div>
            </div>

            <div className={styles.order_preview_element}>
              <div className={styles.order_preview_element_title}>
                <p>Вес</p>
              </div>
              <div className={styles.order_preview_element_info}>
                {weightValue && selectedUnit ? <img src={weight_icon} className={icon_styles.title_icon}></img> : <img src={weight_icon} className={icon_styles.preview_order_icon}></img>}
                <p style={{ color: weightValue && selectedUnit ? 'black' : 'var(--inactive-text-color)' }}>
                  {weightValue ? `${weightValue} ${selectedUnit}` : 'Нет данных'}
                </p>
              </div>
            </div>

            <div className={styles.order_preview_element}>
              <div className={styles.order_preview_element_title}>
                <p>Объём</p>
              </div>
              <div className={styles.order_preview_element_info}>
                {amountValue ? <img src={amount_icon} className={icon_styles.title_icon}></img> : <img src={amount_icon} className={icon_styles.preview_order_icon}></img>}
                <p style={{ color: amountValue ? 'black' : 'var(--inactive-text-color)' }}>
                  {amountValue ? (<>{amountValue} <span className={amount_styles.amount_value_preview}>м<sup>3</sup></span></>) : ('Нет данных')}
                </p>
              </div>
            </div>

            <div className={styles.order_preview_element}>
              <div className={styles.order_preview_element_title}>
                <p>Когда</p>
              </div>
              <div className={styles.order_preview_element_info}>
                <img
                  src={calendar_icon}
                  className={isDateAndTimeComplete() ? icon_styles.title_icon : icon_styles.preview_order_icon}
                />
                <p style={{ color: isDateAndTimeComplete() ? 'black' : 'var(--inactive-text-color)' }}>
                  {formatOutput()}
                </p>
              </div>
            </div>

            <div className={styles.order_preview_element}>
              <div className={styles.order_preview_element_title}>
                <p>Маршрут</p>
              </div>
              <div className={styles.order_preview_element_info}>
                {onLoadingCityValue && onLoadingValue ? <img src={point_icon} className={icon_styles.add_order_icon}></img> : <img src={point_icon} className={icon_styles.preview_order_icon}></img>}
                <div className={styles.order_preview_element_place}>
                  <p style={{ color: onLoadingCityValue ? 'black' : 'var(--inactive-text-color)' }}>
                    {onLoadingCityValue ? onLoadingCityValue : 'Нет данных'}
                  </p>
                  <p className={styles.order_preview_address_text}>
                    {onLoadingValue ? onLoadingValue : 'Нет данных'}
                  </p>
                </div>
              </div>

              {additionalBlocks.map((block, index) => (
                <div key={index} className={styles.order_preview_element_info}>
                  {block.city && block.address ? <img src={point_icon} className={icon_styles.add_order_icon}></img> : <img src={point_icon} className={icon_styles.preview_order_icon}></img>}
                  <div className={styles.order_preview_element_place}>
                    <p style={{ color: block.city ? 'black' : 'var(--inactive-text-color)' }}>
                      {block.city ? block.city : 'Нет данных'}
                    </p>
                    <p className={styles.order_preview_address_text}>
                      {block.address ? block.address : 'Нет данных'}
                    </p>
                  </div>
                </div>
              ))}

              <div className={styles.order_preview_element_info}>
                {onUnloadingCityValue && onUnloadingValue ? <img src={point_icon} className={icon_styles.title_icon}></img> : <img src={point_icon} className={icon_styles.preview_order_icon}></img>}
                <div className={styles.order_preview_element_place}>
                  <p style={{ color: onUnloadingCityValue ? 'black' : 'var(--inactive-text-color)' }}>
                    {onUnloadingCityValue ? onUnloadingCityValue : 'Нет данных'}
                  </p>
                  <p className={styles.order_preview_address_text}>
                    {onUnloadingValue ? onUnloadingValue : 'Нет данных'}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.order_preview_element}>
              <div className={styles.order_preview_element_title}>
                <p>Километраж</p>
              </div>
              <div className={styles.order_preview_element_info}>
                {distanceValue !== null ? (
                  <img src={path_icon} className={icon_styles.title_icon} alt='Километраж' />
                ) : (
                  <img src={path_icon} className={icon_styles.preview_order_icon} alt='Километраж' />
                )}
                <p style={{ color: distanceValue !== null ? 'black' : 'var(--inactive-text-color)' }}>
                  {distanceValue !== null ? (
                    <>{distanceValue} <span className={styles.order_temp_text}>км</span></>
                  ) : (
                    'Нет данных'
                  )}
                </p>
              </div>
            </div>
          </div>

          <Button
            buttonTheme={ButtonThemes.RED_FILLED}
            className={cn(button_styles.button, button_styles.button_width300px)}
            disabled={isButtonDisabled}
            onClick={mode === 'edit' ? handleSaveChanges : handleOrderSubmit}
          >
            {mode === 'edit' ? 'Сохранить изменения' : 'Оформить заявку'}
          </Button>
        </div>
      </div>
    </div>
  );
}