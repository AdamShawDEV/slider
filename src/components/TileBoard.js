import { useContext, useState } from "react";
import { SettingsContext } from "./hooks/settingsContext";
import useWindowDimensions from "./hooks/useWindowDimensions";
import {
  GAME_STATE,
  BASE_BOARD_WIDTH_HEIGHT,
  BASE_TILE_GAP,
  BASE_BOARD_PADDING,
  HEADER_HEIGHT,
} from "../CONSTS";
import styles from "./modules/TileBoard.module.css";
import useProgressiveImage from "./hooks/useProgressiveImage";
import { checkBoard, createBoard } from "../gameLogic";
import Spinner from "./Spinner";

function TileBoard({
  gameState,
  startTimer,
  isTimerRunning,
  numMovesRef,
  endGame,
}) {
  const { settings } = useContext(SettingsContext);
  const [board, setBoard] = useState(() => createBoard(settings.puzzleType));
  const { windowDimentions } = useWindowDimensions();
  const bgImage = useProgressiveImage(`./images/${settings.picture}.png`);
  const isLoading = !bgImage;

  function tileClickHandler(id) {
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
    BASE_BOARD_WIDTH_HEIGHT + BASE_BOARD_PADDING * 2,
    windowDimentions.width - BASE_BOARD_PADDING * 2,
    windowDimentions.height - (HEADER_HEIGHT + BASE_BOARD_PADDING + 2)
  );
  const scaleFactor = boardWidth / BASE_BOARD_WIDTH_HEIGHT;
  const BASE_TILE_WIDTH_HEIGHT =
    (BASE_BOARD_WIDTH_HEIGHT - (settings.puzzleType - 1) * BASE_TILE_GAP) /
    settings.puzzleType;
  const tileWidthHeight = BASE_TILE_WIDTH_HEIGHT * scaleFactor;
  const boardWidthHeight = BASE_BOARD_WIDTH_HEIGHT * scaleFactor;
  const tileGap = BASE_TILE_GAP * scaleFactor;

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.boardContainer}>
      <div
        className={styles.board}
        style={computedStyles.board(boardWidthHeight)}
      >
        {board.map((tile, idx) =>
          tile.isBlank ? null : (
            <div
              key={idx}
              className={styles.tile}
              style={computedStyles.tile(
                tile.pos,
                tileGap,
                tile.imagePos,
                tileWidthHeight,
                bgImage,
                settings.puzzleType
              )}
              onClick={() => tileClickHandler(idx)}
            >
              {settings.showNums && tile.id + 1}
            </div>
          )
        )}
      </div>
    </div>
  );
}

const computedStyles = {
  board: (boardWidthHeight) => ({
    width: boardWidthHeight,
    height: boardWidthHeight,
  }),
  tile: (pos, tileGap, imagePos, tileWidthHeight, bgImage, puzzleType) => ({
    top: (tileWidthHeight + tileGap) * pos.row,
    left: (tileWidthHeight + tileGap) * pos.col,
    width: tileWidthHeight,
    height: tileWidthHeight,
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: `${-(tileWidthHeight * imagePos.col)}px ${
      -tileWidthHeight * imagePos.row
    }px`,
    backgroundSize: `${puzzleType}00%`,
  }),
};

export default TileBoard;
