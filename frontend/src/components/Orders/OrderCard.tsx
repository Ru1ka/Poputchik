import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import styles from './OrdersLog.module.css';
import container_styles from '../../UI/containers.module.css';
import calendar from '../../assets/icons/Calendar.svg';
import path from '../../assets/icons/Path.svg';
import volume from '../../assets/icons/Volume.svg';
import weight from '../../assets/icons/Weight.svg';
import cargo from '../../assets/icons/Cargo.svg';
import pathArrow from '../../assets/icons/Path_arrow.svg';
import temp from '../../assets/icons/Temp_regime.svg';

import RedBox from './RedBox';
import Order, { OrderStatus } from './OrderModel';
import OrderStatusElement from './OrderStatus';
import formatDate from '../dateFormatter';
import { ORDER_PAGE } from '../../router/paths';
import formatPrice from '../priceFormatter';
import Button from '../../UI/Button/Button';
import { ButtonThemes } from '../../UI/Button/ButtonTypes';
import Input from '../../UI/Input/Input';
import { InputThemes } from '../../UI/Input/InputTypes';
import Dropdown from '../OrderInputs/WeightDropdown';
import { Tooltip } from 'react-tooltip';
import fetchPostAdminOrder from '../../fetch_functions/fetchPostAdminOrder';

import header_styles from '../Header/Header.module.css';

const OrderCard = (props: { order: Order }) => {
  const navigate = useNavigate();

  const handleEditOrder = () => {
    console.log("Editing order:", props.order.id);
    if (!localStorage.getItem('admin')) { 
      navigate(ORDER_PAGE, { state: { order: props.order, mode: 'edit' } });
    }
  };

  const handleRepeatOrder = () => {
    console.log("Repeating order:", props.order.id);
    navigate(ORDER_PAGE, { state: { order: props.order, mode: 'repeat' } });
  };

  const [adminPrice, setAdminPrice] = useState<string>(props.order.cost.toString());
  const [adminStatus, setAdminStatus] = useState<string>(props.order.status);
  const [vatValue, setVatValue] = useState<boolean>(props.order.VAT);

  useEffect(() => {
    setVatValue(props.order.VAT);
  }, [props.order]);

  const generateOptions = <T extends string>(enumValues: T[]) => {
    return enumValues.map((value: T) => ({
      label: value,
      value: value,
    }));
  };

  const distanceInKm = Math.floor(props.order.distance / 1000);

  const cargoDescription = `${props.order.cargo}${props.order.package_type ? `, ${props.order.package_type}` : ''}${props.order.package_count ? `, ${props.order.package_count} шт.` : ''}`;

  console.log("Rendering OrderCard for order ID:", props.order.id);

  return (
    <div className={styles.centeredFrameSmall}>
      <div className={styles.infoAndPriceContainer}>
        <div className={cn(container_styles.flex_col, container_styles.gap_20)} style={{ maxWidth: 'none' }}>
          <div className={styles.cardHeaderContainer}>
            <div className={cn(container_styles.flex_row, container_styles.gap_20)}>
              <h3>{props.order.readable_id}</h3>
              <div className={cn(styles.text, styles.date)}>
                <img className={styles.calendarImage} src={calendar} alt="Calendar" />
                {formatDate(props.order.loading_time)}
              </div>
            </div>
            <OrderStatusElement status={props.order.status} />
          </div>

          <div className={cn(container_styles.flex_row, container_styles.gap_10)} style={{ maxWidth: 500, flexWrap: 'wrap' }}>
            <RedBox startImgSrc={path} text={`${distanceInKm} км`} done={props.order.status === 'Delivered'} />
            <RedBox startImgSrc={volume} text={`${props.order.amount} м³`} done={props.order.status === 'Delivered'} />
            <RedBox startImgSrc={weight} text={`${props.order.readable_weight}`} done={props.order.status === 'Delivered'} />
            <RedBox
              startImgSrc={cargo}
              endImgSrc={props.order.temperature_condition ? temp : undefined}
              text={cargoDescription}
              done={props.order.status === 'Delivered'}
            />
          </div>

          <div className={styles.pathContainer}>
            <div>
              <div style={{ fontWeight: 500, fontSize: '15px', lineHeight: '17px' }}>{props.order.loading_points[0].locality}</div>
              <div className="hint" style={{ wordBreak: 'break-word' }}>{props.order.loading_points[0].address}</div>
            </div>
            <img src={pathArrow} className={styles.arrowImage} alt="Path arrow" />
            <div>
              <div style={{ fontWeight: 500, fontSize: '15px', lineHeight: '17px' }}>{props.order.unloading_points[0].locality}</div>
              <div className="hint" style={{ wordBreak: 'break-word' }}>{props.order.unloading_points[0].address}</div>
            </div>
          </div>
        </div>

        {!localStorage.getItem('admin') ? (
          <div className={styles.priceAndRepeatContainer}>
            <div className={styles.button_edit} data-tooltip-id="order-options-tooltip">
              <div className={styles.button_circle}></div>
              <div className={styles.button_circle}></div>
              <div className={styles.button_circle}></div>
            </div>
            <Tooltip
              id="order-options-tooltip"
              place="bottom"
              className={cn(header_styles.tooltip, header_styles.littleTooltip, header_styles.onlyBigScreen)}
              clickable={true}
              noArrow={true}
              offset={28}
              opacity={1}
              delayHide={200}
              disableStyleInjection={true}
              openOnClick
            >
              <Button buttonTheme={ButtonThemes.RED} className={cn(styles.littleRow, styles.redText)} onClick={handleEditOrder}>
                Редактировать
              </Button>
            </Tooltip>
            <div style={{ marginBlock: 'auto' }}>
              <h2 className={styles.price}>{`${formatPrice(props.order.cost.toString())} ₽`}</h2>
              <div className="hint">{vatValue ? 'с НДС' : 'без НДС'}</div>
            </div>
            <div className={styles.redText} onClick={(e) => { e.stopPropagation(); handleRepeatOrder(); }}>Повторить</div>
          </div>
        ) : (
          <div className={cn(styles.priceAndRepeatContainer, container_styles.flex_col, container_styles.gap_10)}>
            <div className={cn(container_styles.flex_col, container_styles.gap_5)}>
              <h3 className={styles.price}>{`Цена в ₽:`}</h3>
              <Input
                inputTheme={InputThemes.RED}
                autoFocus={false}
                value={adminPrice}
                name="adminPrice"
                placeholder="Цена"
                inputMode="numeric"
                style={{ maxWidth: 160 }}
                onChange={(e) => { setAdminPrice(e.target.value); }}
              />
            </div>
            <div className={cn(container_styles.flex_col, container_styles.gap_5)}>
              <h3 className={styles.price}>{`Статус заказа:`}</h3>
              <Dropdown
                id="order_status"
                value={adminStatus}
                onChange={(value) => { setAdminStatus(value); }}
                options={generateOptions(Object.values(OrderStatus))}
              />
            </div>
            <Button buttonTheme={ButtonThemes.RED_FILLED} onClick={() => fetchPostAdminOrder(props.order, adminPrice, adminStatus)}>
              Сохранить
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
