import cn from "classnames";
import styles from "./MainPage.module.css";

import { useNavigate } from "react-router-dom";

import firstBlockCircle from '../../assets/images/firstBlockCircle.svg'
import firstBlockMan from '../../assets/images/firstBlockMan.svg'
import firstBlockBoxes from '../../assets/images/firstBlockBoxes.svg'
import firstBlockDog from '../../assets/images/firstBlockDog.svg'
import mapImage from '../../assets/images/Map.svg'
import manImage from '../../assets/images/Man.svg'
import womanImage from '../../assets/images/Woman.svg'
import manAndTruck from '../../assets/images/ManAndTruck.svg'

import Button from "../../UI/Button/Button";
import { ButtonThemes } from "../../UI/Button/ButtonTypes";
import Header from "../../components/Header/Header";
import { ORDER_PAGE } from "../../router/paths";


const MainPage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(ORDER_PAGE);
    };

    return (
        <div className={styles.page}>
            <Header/>
            <div className={styles.main}>
                <div className={cn(styles.main_block, styles.block)}>
                    <div className={styles.title}>
                        <h1>Попутчик — вашему <br /> грузу с нами <span className={styles.span}>по пути!</span></h1>
                    </div>
                    <div className={styles.title_button}>
                        <Button buttonTheme={ButtonThemes.RED_FILLED} onClick={handleClick}>Оформить заявку</Button>
                    </div>
                    <img src={firstBlockCircle} className={styles.first_block_circle} />
                    <img src={firstBlockMan} className={styles.first_block_man} />
                    <img src={firstBlockBoxes} className={styles.first_block_boxes} />
                    <img src={firstBlockDog} className={styles.first_block_dog} />
                </div>
                <div className={styles.why_us}>
                    <div className={styles.why_us_block_title}>
                        <h1>Почему выбирают нас</h1>
                    </div>
                    <div className={styles.why_us_block}>
                        <div className={cn(styles.map_block, styles.block_mini)}>
                            <div className={styles.why_us_title}>
                                <h1>Грузоперевозки<br />по всей России</h1>
                            </div>
                            <div className={styles.why_us_subtitle}>
                                <p>Доставка грузов в срок</p>
                            </div>
                            <img src={mapImage} className={styles.map_image} />
                        </div>
                        <div className={styles.right_group}>
                            <div className={styles.up_group}>
                                <div className={cn(styles.man_block, styles.block_mini)}>
                                    <div className={styles.why_us_title}>
                                        <h1>Экономия времени <br />и денег</h1>
                                    </div>
                                    <div className={styles.why_us_subtitle}>
                                        <p>Оптимизация <br />маршрутов <br />и заказов</p>
                                    </div>
                                    <img src={manImage} className={styles.man_image} />
                                </div>
                                <div className={cn(styles.woman_block, styles.block_mini)}>
                                    <div className={styles.why_us_title}>
                                        <h1>Безопасность <br />и надёжность</h1>
                                    </div>
                                    <div className={styles.why_us_subtitle}>
                                        <p>Строгая проверка <br />всех перевозчиков</p>
                                    </div>
                                    <img src={womanImage} className={styles.woman_image} />
                                </div>
                            </div>
                            <div className={cn(styles.man_and_truck_block, styles.block_mini)}>
                                <div className={styles.why_us_title}>
                                    <h1>Отслеживание грузов <br />и поддержка 24/7</h1>
                                </div>
                                <div className={styles.why_us_subtitle}>
                                    <p>Контроль перевозки и помощь <br />в любое время</p>
                                </div>
                                <img src={manAndTruck} className={styles.man_and_truck_image} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;