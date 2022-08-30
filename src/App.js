import './App.css';
import { useContext, useEffect, useState } from 'react';
import { AiOutlineSetting } from 'react-icons/ai';
import Modal from './components/Modal';
import { SettingsContextProvider, SettingsContext } from './components/hooks/settingsContext';
import useWindowDimensions from './components/hooks/useWindowDimensions';

const CONSTS = {
  defaultSize: 5,
  maxBoardWidth: 560,
  maxBoardHeight: 560,
  tileGap: 10,
  imageURI: '/images/flowers.jpg',
}

async function shuffleBoard(board, numCols, numRows) {

  // applying only legal moves shuffle the puzzle
  for (let i = 0; i < 500; i++) {
    // get blank tiles position
    const blankPos = board[board.length - 1].pos;

    let newPos = { row: blankPos.row, col: blankPos.col };

    // get random direction row or col
    const direction = Math.round(Math.random() + 1);
    const difference = Math.round(Math.random()) === 0 ? -1 : 1;

    if (direction === 1) { //row
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

function TileBoard({ board, setBoard }) {
  const { settings } = useContext(SettingsContext);
  const { windowDimentions } = useWindowDimensions();
  const consts = {
    tileWidth: CONSTS.boardWidth / settings.puzzleType,
    tileHeight: CONSTS.boardHeight / settings.puzzleType,
    tileGap: CONSTS.tileGap,
  }

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

  const boardWidth = Math.min(CONSTS.maxBoardWidth, windowDimentions.width, windowDimentions.height);
  const tileWidth = (boardWidth - (settings.puzzleType - 1) * consts.tileGap) / settings.puzzleType;


  return (
    <div className='boardContainer' >
      <div className='board' style={{
        width: `${boardWidth}px`,
        height: `${boardWidth}px`,
      }}>
        {board.map((tile, idx) =>
          tile.isBlank ? null :
            <div key={idx}
              className="tile"
              style={{
                top: `${tileWidth * tile.pos.row + consts.tileGap * tile.pos.row}px`,
                left: `${tileWidth * tile.pos.col + consts.tileGap * tile.pos.col}px`,
                height: `${tileWidth}px`,
                width: `${tileWidth}px`,
                backgroundImage: 'url(./images/flowers.jpg)',
                backgroundPosition: `${-(tileWidth * tile.imagePos.col)}px ${-(tileWidth * tile.imagePos.row)}px`
              }}
              onClick={() => onClickHandler(tile.id)}>
              {settings.showNums && tile.id + 1}</div>
        )}
      </div>
    </div>
  );
}

function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [puzzleType, setPuzzleType] = useState("");
  const [picture, setPicture] = useState('flower');
  const [showNums, setShowNums] = useState(false);
  const { settings, setSettings } = useContext(SettingsContext);

  function onSettingsBtnClick() {
    setPuzzleType(settings.puzzleType);
    setPicture(settings.picture);
    setShowNums(settings.showNums);

    setSettingsOpen(true);
  }

  function onCancelBtnClick() {
    setPuzzleType(settings.puzzleType);
    setPicture(settings.picture);
    setSettingsOpen(false);
  }

  function onFormSubmint(e) {
    e.preventDefault();

    setSettings({
      puzzleType,
      picture,
      showNums,
    });
    setSettingsOpen(false);
  }

  return (
    <>
      <header className='header'>
        <span className='title'>Slider</span>
        <div className='settingBtn' onClick={onSettingsBtnClick}>
          <AiOutlineSetting />
        </div>
      </header>
      {settingsOpen && <Modal>
        <h1>Settings</h1>
        <form onSubmit={(e) => onFormSubmint(e)}>
          <label>Type: </label>
          <select value={puzzleType} onChange={(e) => setPuzzleType(e.target.value)}>
            <option value='3'>3 x 3</option>
            <option value='4'>4 x 4</option>
            <option value='5'>5 x 5</option>
            <option value='6'>6 x 6</option>
            <option value='7'>7 x 7</option>
            <option value='8'>8 x 8</option>
          </select>
          <label>Picture: </label>
          <select value={picture} onChange={(e) => setPicture(e.target.value)}>
            <option value='flower'>flower</option>
            <option value='car'>car</option>
            <option value='cat'>cat</option>
          </select>
          <label>Show Numbers:</label>
          <input type='checkbox' value={showNums} onChange={() => setShowNums(!showNums)} />
          <input type='submit' value='Submit' />
          <button onClick={onCancelBtnClick}>cancel</button>
        </form>
      </Modal>}
    </>
  );
}

function TileGame() {
  const [board, setBoard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    const loadBoard = async () => {
      const newBaord = await createBoard(settings.puzzleType, settings.puzzleType)
      setBoard(newBaord);
      setIsLoading(false);
    }

    loadBoard();
  }, [settings.puzzleType]);

  if (isLoading) return <div>loading</div>;

  return (
    <>
      <Header />
      <main className='main'>
        <TileBoard board={board} setBoard={setBoard} />
      </main>
    </>
  );
}

function App() {

  return (
    <SettingsContextProvider>
      <div className="App">
        <TileGame />
      </div>
    </SettingsContextProvider>
  );
}

export default App;
