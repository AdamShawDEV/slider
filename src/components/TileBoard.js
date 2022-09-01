import { useContext, useState, useEffect } from 'react';
import { SettingsContext } from './hooks/settingsContext';
import useWindowDimensions from './hooks/useWindowDimensions';
import CONSTS, { GAME_STATE } from '../consts';
import styles from './modules/TileBoard.module.css'

function TileBoard({ gameState, startTimer, isTimerRunning, numMovesRef, endGame, stopTimer, resetTimer }) {
  const [board, setBoard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useContext(SettingsContext);
  const { windowDimentions } = useWindowDimensions();
  const consts = {
    tileWidth: CONSTS.boardWidth / settings.puzzleType,
    tileHeight: CONSTS.boardHeight / settings.puzzleType,
    tileGap: CONSTS.tileGap,
  }

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
    // eslint-disable-next-line
}, [settings.puzzleType]);

  function onClickHandler(id) {
    if (gameState !== GAME_STATE.PLAYING) return;

    if (!isTimerRunning) startTimer();

    const currTile = board[id];
    const blankTile = board[board.length - 1];

    // check if clicked tile is adjacent 
    if ((Math.abs(currTile.pos.row - blankTile.pos.row) === 1 && currTile.pos.col === blankTile.pos.col) ||
      (Math.abs(currTile.pos.col - blankTile.pos.col) === 1 && currTile.pos.row === blankTile.pos.row)) {

      // swap clicked tile with blank
      const newBoard = [...board];
      const tempPos = newBoard[id].pos;
      newBoard[id].pos = newBoard[newBoard.length - 1].pos;
      newBoard[newBoard.length - 1].pos = tempPos;

      //increment numMoves
      numMovesRef.current = numMovesRef.current + 1;

      if (checkBoard(newBoard, settings.puzzleType)) {
        endGame();
      }

      setBoard(newBoard);
    }
  }

  if (isLoading) return <div>loading</div>;

  const boardWidth = Math.min(CONSTS.maxBoardWidth,
    windowDimentions.width - CONSTS.boardPadding,
    windowDimentions.height - (CONSTS.headerHeight + CONSTS.boardPadding));
  const tileWidth = (boardWidth - (settings.puzzleType - 1) * consts.tileGap) / settings.puzzleType;

  return (
    <div className={styles.boardContainer} >
      <div className={styles.board} style={{
        width: `${boardWidth}px`,
        height: `${boardWidth}px`,
      }}>
        {board.map((tile, idx) =>
          tile.isBlank ? null :
            <div key={idx}
              className={styles.tile}
              style={{
                top: `${tileWidth * tile.pos.row + consts.tileGap * tile.pos.row}px`,
                left: `${tileWidth * tile.pos.col + consts.tileGap * tile.pos.col}px`,
                height: `${tileWidth}px`,
                width: `${tileWidth}px`,
                backgroundImage: `url(./images/${settings.picture}.png)`,
                backgroundPosition: `${-(tileWidth * tile.imagePos.col)}px ${-(tileWidth * tile.imagePos.row)}px`,
                backgroundSize: `${settings.puzzleType}00%`,
              }}
              onClick={() => onClickHandler(tile.id)}>
              {settings.showNums && tile.id + 1}</div>
        )}
      </div>
    </div>
  );
}

function checkBoard(board, puzzleType) {

  for (let i = 0; i < board.length; i++) {
    if (board[i].pos.row !== Math.floor(i /puzzleType) ||
      board[i].pos.col !== i % puzzleType)
      return false;
  }

  return true;
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

export default TileBoard;