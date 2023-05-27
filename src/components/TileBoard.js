import { useContext, useState, useEffect } from "react";
import { SettingsContext } from "./hooks/settingsContext";
import useWindowDimensions from "./hooks/useWindowDimensions";
import CONSTS, { GAME_STATE } from "../consts";
import styles from "./modules/TileBoard.module.css";

function TileBoard({
  gameState,
  startTimer,
  isTimerRunning,
  numMovesRef,
  endGame,
  stopTimer,
  resetTimer,
}) {
  const [board, setBoard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useContext(SettingsContext);
  const { windowDimentions } = useWindowDimensions();
  const bgImage = useProgressiveImage(`./images/${settings.picture}.png`);

  useEffect(() => {
    const loadBoard = async () => {
      // create and shuffle board
      const newBaord = await createBoard(
        settings.puzzleType,
        settings.puzzleType
      );
      setBoard(newBaord);
      setIsLoading(false);

      // reset and stop timer
      stopTimer();
      resetTimer();
      numMovesRef.current = 0;
    };

    loadBoard();
    // eslint-disable-next-line
  }, [settings.puzzleType]);

  function onClickHandler(id) {
    if (gameState !== GAME_STATE.PLAYING) return;

    if (!isTimerRunning) startTimer();

    const currTile = board[id];
    const blankTile = board[board.length - 1];

    // check if clicked tile is adjacent
    if (
      (Math.abs(currTile.pos.row - blankTile.pos.row) === 1 &&
        currTile.pos.col === blankTile.pos.col) ||
      (Math.abs(currTile.pos.col - blankTile.pos.col) === 1 &&
        currTile.pos.row === blankTile.pos.row)
    ) {
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

  const boardWidth = Math.min(
    CONSTS.maxBoardWidth,
    windowDimentions.width - CONSTS.boardPadding,
    windowDimentions.height - (CONSTS.headerHeight + CONSTS.boardPadding)
  );
  const scaleFactor = boardWidth / CONSTS.maxBoardWidth;
  const gap = CONSTS.tileGap * scaleFactor;
  const tileWidth =
    (boardWidth - (settings.puzzleType - 1) * gap) / settings.puzzleType;

  if (isLoading || !bgImage)
    return (
      <div className={styles.boardContainer}>
        <div
          className={styles.board}
          style={{
            width: `${boardWidth}px`,
            height: `${boardWidth}px`,
          }}
        >
          <div className={styles.spinnerContainer}>
            <svg
              aria-hidden="true"
              className={styles.spinner}
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.boardContainer}>
      <div
        className={styles.board}
        style={{
          width: `${boardWidth}px`,
          height: `${boardWidth}px`,
        }}
      >
        {board.map((tile, idx) =>
          tile.isBlank ? null : (
            <div
              key={idx}
              className={styles.tile}
              style={{
                top: `${tileWidth * tile.pos.row + gap * tile.pos.row}px`,
                left: `${tileWidth * tile.pos.col + gap * tile.pos.col}px`,
                height: `${tileWidth}px`,
                width: `${tileWidth}px`,
                backgroundImage: `url(${bgImage})`,
                backgroundPosition: `${-(tileWidth * tile.imagePos.col)}px ${-(
                  tileWidth * tile.imagePos.row
                )}px`,
                backgroundSize: `${settings.puzzleType}00%`,
              }}
              onClick={() => onClickHandler(tile.id)}
            >
              {settings.showNums && tile.id + 1}
            </div>
          )
        )}
      </div>
    </div>
  );
}

const useProgressiveImage = (src) => {
  const [sourceLoaded, setSourceLoaded] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setSourceLoaded(src);
  }, [src]);

  return sourceLoaded;
};

function checkBoard(board, puzzleType) {
  for (let i = 0; i < board.length; i++) {
    if (
      board[i].pos.row !== Math.floor(i / puzzleType) ||
      board[i].pos.col !== i % puzzleType
    )
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

    if (direction === 1) {
      //row
      // create and evaluate new position, if direction is invalid swap the direction
      newPos = {
        ...newPos,
        row:
          blankPos.row + difference >= 0 && blankPos.row + difference < numRows
            ? blankPos.row + difference
            : blankPos.row - difference,
      };
    } else {
      // col
      newPos = {
        ...newPos,
        col:
          blankPos.col + difference >= 0 && blankPos.col + difference < numCols
            ? blankPos.col + difference
            : blankPos.col - difference,
      };
    }

    const tileID = board.findIndex(
      (item) => item.pos.row === newPos.row && item.pos.col === newPos.col
    );

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
        id: x * row + col,
        isBlank: false,
        imagePos: { row, col },
        pos: { row, col },
      };
    }
  }

  board[x * y - 1].isBlank = true;

  await shuffleBoard(board, x, y);

  return board;
}

export default TileBoard;
