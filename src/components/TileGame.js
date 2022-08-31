import { useState, useContext, useEffect, useRef } from 'react';
import { SettingsContext } from './hooks/settingsContext';
import CONSTS, { GAME_STATE } from '../consts';
import Header from './Header';
import TileBoard from './TileBoard';
import Modal from './Modal';
import useTimer from './hooks/useTimer';
import useStatsReducer from './hooks/useStatsReducer';

function TileGame({ startNewGame }) {
    const [board, setBoard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { settings } = useContext(SettingsContext);
    const [gameState, setGameState] = useState(GAME_STATE.PLAYING);
    let numMovesRef = useRef(0);
    const { secondsElapsed, startTimer, stopTimer, isTimerRunning, resetTimer } = useTimer();
    const { stats, statsDispatch } = useStatsReducer();

    useEffect(() => {
        const loadBoard = async () => {
            const newBaord = await createBoard(settings.puzzleType, settings.puzzleType)
            setBoard(newBaord);
            setIsLoading(false);

            // reset and stop timer
            stopTimer();
            resetTimer();
            numMovesRef.current = 0;
        }

        loadBoard();
    }, [settings.puzzleType]);

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

    if (isLoading) return <div>loading</div>;

    return (
        <>
            <Header secondsElapsed={secondsElapsed} />
            <main className='main'>
                <TileBoard board={board}
                    setBoard={setBoard}
                    gameState={gameState}
                    startTimer={startTimer}
                    isTimerRunning={isTimerRunning}
                    numMovesRef={numMovesRef}
                    endGame={endGame} />
            </main>
            {gameState !== GAME_STATE.PLAYING && <Modal>
                <h1>Statistics</h1>
                <h2>games played</h2>
                <span>{stats.gamesPlayed}</span>
                <h2>best times</h2>
                {Object.keys(stats.bestTimes).map(key => 
                    <div key={key}>
                        <div>{stats.bestTimes[key].picture}</div>
                        <div>{stats.bestTimes[key].puzzleType}</div>
                        <div>{stats.bestTimes[key].showNums}</div>
                        <div>{stats.bestTimes[key].time}</div>
                        <div>{stats.bestTimes[key].numMoves}</div>
                    </div>
                )}
                <button onClick={startNewGame}>new game</button>
            </Modal>}
        </>
    );
}

async function shuffleBoard(board, numCols, numRows) {

    // applying only legal moves to shuffle the puzzle
    for (let i = 0; i < CONSTS.numSuffleMoves; i++) {
        // get blank tiles position
        const blankPos = board[board.length - 1].pos;

        let newPos = { row: blankPos.row, col: blankPos.col };

        // get random direction row or col
        const direction = Math.round(Math.random() + 1);

        // get random direction + or -
        const difference = Math.round(Math.random()) === 0 ? -1 : 1;

        if (direction === 1) { //row
            // create and evaluate new position, if direction is invalid swap the direction
            newPos = { ...newPos, row: (blankPos.row + difference >= 0 && blankPos.row + difference < numRows ? blankPos.row + difference : blankPos.row - difference) };
        } else { // col
            newPos = { ...newPos, col: (blankPos.col + difference >= 0 && blankPos.col + difference < numCols ? blankPos.col + difference : blankPos.col - difference) };
        }

        const tileID = board.findIndex((item) => item.pos.row === newPos.row && item.pos.col === newPos.col);

        // swap tiles
        const tempPos = board[tileID].pos;
        board[tileID].pos = board[board.length - 1].pos;
        board[board.length - 1].pos = tempPos;
    }
}

async function createBoard(x, y) {
    let board = Array(x * y);

    for (let row = 0; row < y; row++) {
        for (let col = 0; col < x; col++) {
            board[x * row + col] = {
                id: (x * row) + col,
                isBlank: false,
                imagePos: { row, col, },
                pos: { row, col, },
            };
        }
    }

    board[x * y - 1].isBlank = true;

    await shuffleBoard(board, x, y);

    return board;
}

export default TileGame;