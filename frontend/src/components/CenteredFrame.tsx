import backArrow from '../assets/icons/back_arrow.svg'
import styles from './CenteredFrame.module.css'
import Button from '../UI/Button/Button'
import { ButtonThemes } from '../UI/Button/ButtonTypes'
import poputchikLogo from '../assets/icons/Logo_full.svg'
import plus from '../assets/icons/addPointIcon.svg'
import { useContext } from 'react'
import { ModalContext } from './Modal/ModalContext'


interface CenteredFrameProps {
    showBackArrow: boolean,
    clickBackArrowHandler: React.MouseEventHandler<HTMLButtonElement>,
    children: React.ReactNode,
}

function CenteredFrame(props: CenteredFrameProps) {
    const { closeModal } = useContext(ModalContext);

    return (
        <div className={styles.centeredFrameWrapper} onClick={closeModal}>
            <div className={styles.centeredFrame} onClick={(e) => e.stopPropagation()}>
                {props.showBackArrow &&
                    <Button buttonTheme={ButtonThemes.GO_BACK_ARROW} onClick={props.clickBackArrowHandler}>
                        <img src={backArrow} />
                    </Button>
                }
                <Button buttonTheme={ButtonThemes.CLOSE_MODAL} onClick={closeModal}>
                    <img src={plus} />
                </Button>
                <img src={poputchikLogo} className={styles.logo} alt="Logo" />
                {props.children}
            </div>
        </div>
    )
}

export default CenteredFrame