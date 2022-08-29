import './App.css';
import { useState } from 'react';

const CONSTS = {
  tileHeight: 70,
  tileWidth: 70,
  tileGap: 5,
  imageURI: '/images/flowers.jpg',
  numRows: 5,
  numCols: 5,
}

function shuffleBoard(board) {

  // applying only legal moves shuffle the puzzle
  for (let i = 0; i < 500; i++) {
    // get blank tiles position
    const blankPos = board[board.length - 1].pos;

    let newPos = { row: blankPos.row, col: blankPos.col };

    // get random direction row or col
    const direction = Math.round(Math.random() + 1);
    const difference = Math.round(Math.random()) === 0 ? -1 : 1;

    if (direction === 1) { //row
      newPos = { ...newPos, row: ( blankPos.row + difference >= 0 && blankPos.row + difference < CONSTS.numRows ? blankPos.row + difference : blankPos.row - difference ) };
    } else { // col
      newPos = { ...newPos, col: ( blankPos.col + difference >= 0 && blankPos.col + difference < CONSTS.numCols ? blankPos.col + difference : blankPos.col - difference ) };
    }

    const tileID = board.findIndex((item) => item.pos.row === newPos.row && item.pos.col === newPos.col );

    // swap tiles
    const tempPos = board[tileID].pos;
    board[tileID].pos = board[board.length - 1].pos;
    board[board.length - 1].pos = tempPos;
  }
}

function createBoard(x, y) {
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

  shuffleBoard(board);

  return board;
}

function TileBoard({ board, setBoard }) {

  function onClickHandler(id) {
    const currTile = board[id];
    const blankTile = board[board.length - 1];

    if ((Math.abs(currTile.pos.row - blankTile.pos.row) === 1 && currTile.pos.col === blankTile.pos.col) ||
      (Math.abs(currTile.pos.col - blankTile.pos.col) === 1 && currTile.pos.row === blankTile.pos.row)) {

      // swap clicked tile with blank
      const newBoard = [...board];
      const tempPos = newBoard[id].pos;
      newBoard[id].pos = newBoard[newBoard.length - 1].pos;
      newBoard[newBoard.length - 1].pos = tempPos;

      setBoard(newBoard);
    }
  }


  return (
    <div className='boardContainer' >
      <div className='board' style={{
        width: `${CONSTS.numCols * CONSTS.tileWidth + (CONSTS.numCols - 1) * CONSTS.tileGap}px`,
        height: `${CONSTS.numRows * CONSTS.tileHeight + (CONSTS.numRows - 1) * CONSTS.tileGap}px`,
      }}>
        {board.map((tile, idx) =>
          tile.isBlank ? null :
            <div key={idx}
              className="tile"
              style={{
                top: `${CONSTS.tileHeight * tile.pos.row + CONSTS.tileGap * tile.pos.row}px`,
                left: `${CONSTS.tileWidth * tile.pos.col + CONSTS.tileGap * tile.pos.col}px`,
                height: `${CONSTS.tileHeight}px`,
                width: `${CONSTS.tileWidth}px`,
                backgroundImage: 'url(./images/flowers.jpg)',
                backgroundPosition: `${-(CONSTS.tileWidth * tile.imagePos.col)}px ${-(CONSTS.tileHeight * tile.imagePos.row)}px`
              }}
              onClick={() => onClickHandler(tile.id)}>{tile.id}</div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [board, setBoard] = useState(() => createBoard(CONSTS.numCols, CONSTS.numRows));

  return (
    <div className="App">
      <header><span className='title'>Slider</span></header>
      <main className='main'>
        <TileBoard board={board} setBoard={setBoard} />
      </main>
    </div>
  );
}

export default App;
