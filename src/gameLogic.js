import { NUM_SUFFLE_MOVES } from "./CONSTS";

export function checkBoard(board, puzzleType) {
  for (let i = 0; i < board.length; i++) {
    if (
      board[i].pos.row !== Math.floor(i / puzzleType) ||
      board[i].pos.col !== i % puzzleType
    )
      return false;
  }

  return true;
}

function shuffleBoard(board, numCols, numRows) {
  // applying only legal moves to shuffle the puzzle
  for (let i = 0; i < NUM_SUFFLE_MOVES; i++) {
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

export function createBoard(puzzleType) {
  let board = [];

  for (let row = 0; row < puzzleType; row++) {
    for (let col = 0; col < puzzleType; col++) {
      board.push({
        imagePos: { row, col },
        pos: { row, col },
        isBlank: row === puzzleType - 1 && col === puzzleType - 1,
      });
    }
  }

  shuffleBoard(board, puzzleType, puzzleType);

  return board;
}
