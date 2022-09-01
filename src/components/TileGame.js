import { useState, useContext, useRef } from 'react';
import { SettingsContext } from './hooks/settingsContext';
import { GAME_STATE } from '../consts';
import Header from './Header';
import TileBoard from './TileBoard';
import Modal from './Modal';
import useTimer from './hooks/useTimer';
import useStatsReducer from './hooks/useStatsReducer';
import style from './modules/TileGame.module.css';

function TileGame({ startNewGame }) {
    const { settings } = useContext(SettingsContext);
    const [gameState, setGameState] = useState(GAME_STATE.PLAYING);
    let numMovesRef = useRef(0); // used ref as value is not used in rendering
    const { secondsElapsed, startTimer, stopTimer, isTimerRunning, resetTimer } = useTimer();
    const { stats, statsDispatch } = useStatsReducer();

    function endGame() {
        setGameState(GAME_STATE.WON);
        stopTimer();
        statsDispatch({
            type: 'logGame',
            time: secondsElapsed,
            picture: settings.picture,
            puzzleType: settings.puzzleType,
            showNums: settings.showNums,
            numMoves: numMovesRef.current,
        });
    }

    return (
        <>
            <Header secondsElapsed={secondsElapsed} />
            <main className={style.main}>
                <TileBoard
                    gameState={gameState}
                    startTimer={startTimer}
                    stopTimer={stopTimer}
                    resetTimer={resetTimer}
                    isTimerRunning={isTimerRunning}
                    numMovesRef={numMovesRef}
                    endGame={endGame} />
            </main>
            {gameState !== GAME_STATE.PLAYING && <Modal>
                <div className={style.statsModal}>
                    <h1>Statistics</h1>
                    <h2>games played</h2>
                    <span>{stats.gamesPlayed}</span>
                    <h2>best times</h2>
                    <table>
                        <thead>
                            <th>picture</th>
                            <th>type</th>
                            <th>time</th>
                            <th>moves</th>
                            <th>numbers</th>
                        </thead>
                        <tbody>
                            {Object.keys(stats.bestTimes).map(key =>
                                <tr key={key}>
                                    <td>{stats.bestTimes[key].picture}</td>
                                    <td>{`${stats.bestTimes[key].puzzleType}x${stats.bestTimes[key].puzzleType}`}</td>
                                    <td>{stats.bestTimes[key].time}</td>
                                    <td>{stats.bestTimes[key].numMoves}</td>
                                    <td>{stats.bestTimes[key].showNums ? 'on' : 'off'}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <button onClick={startNewGame}>new game</button>
                </div>
            </Modal>}
        </>
    );
}

export default TileGame;