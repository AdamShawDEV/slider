import styles from './modules/TimerDisplay.module.css';

function TimerDisplay({ secondsElapsed }) {

    const seconds = secondsElapsed % 60;
    const minutes = Math.floor(secondsElapsed / 60);
  
    return (
      <div className={styles.timer}>
        {`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`}
      </div>
    )
  }

  export default TimerDisplay;