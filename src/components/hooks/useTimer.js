import { useEffect, useState } from "react";


function useTimer() {
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        if (isTimerRunning) {
            const timerId = setTimeout(() => {
                setSecondsElapsed(curr => curr + 1)
            }, 1000);
                

            return () => clearTimeout(timerId);
        }
    }, [secondsElapsed, isTimerRunning]);

    function resetTimer() {
        setSecondsElapsed(0);
    }

    function startTimer() {
        setIsTimerRunning(true);
    }

    function stopTimer() {
        setIsTimerRunning(false);
    }

    return { secondsElapsed, resetTimer, startTimer, stopTimer, isTimerRunning };
}

export default useTimer;