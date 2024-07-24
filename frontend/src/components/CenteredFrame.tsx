import backArrow from '../assets/icons/back_arrow.svg'
import styles from './CenteredFrame.module.css'
import Button from '../UI/Button/Button'
import { ButtonThemes } from '../UI/Button/ButtonTypes'
import poputchikLogo from '../assets/icons/Logo_full.svg'


interface CenteredFrameProps {
    showBackArrow: boolean,
    clickBackArrowHandler: React.MouseEventHandler<HTMLButtonElement>,
    children: React.ReactNode,
}

function CenteredFrame(props: CenteredFrameProps) {
    return (
        <div className={styles.centeredFrameWrapper}>
            {props.showBackArrow &&
                <Button buttonTheme={ButtonThemes.GO_BACK_ARROW} onClick={props.clickBackArrowHandler}>
                    <img src={backArrow} />
                </Button>
            }

            <div className={styles.centeredFrame}>
                <img src={poputchikLogo} className={styles.logo} alt="Logo" />
                {props.children}
            </div>
        </div>
    )
}

export default CenteredFrame