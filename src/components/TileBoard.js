import { useContext } from 'react';
import { SettingsContext } from './hooks/settingsContext';
import useWindowDimensions from './hooks/useWindowDimensions';
import CONSTS, { GAME_STATE } from '../consts';
import styles from './modules/TileBoard.module.css'

function TileBoard({ board, setBoard, gameState, setGameState }) {
  const { settings } = useContext(SettingsContext);
  const { windowDimentions } = useWindowDimensions();
  const consts = {
    tileWidth: CONSTS.boardWidth / settings.puzzleType,
    tileHeight: CONSTS.boardHeight / settings.puzzleType,
    tileGap: CONSTS.tileGap,
  }

  function onClickHandler(id) {
    if (gameState !== GAME_STATE.PLAYING) return;

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

      if (checkBoard(newBoard, settings.puzzleType))
        setGameState(GAME_STATE.WON);

      setBoard(newBoard);
    }
  }

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

export default TileBoard;