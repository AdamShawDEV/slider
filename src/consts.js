const CONSTS = {
  defaultSize: 5,
  defaultPicture: 'flowers',
  maxBoardWidth: 560,
  maxBoardHeight: 560,
  tileGap: 10,
  imageURI: '/images/flowers.jpg',
  headerHeight: 40,
  boardPadding: 20,
  numSuffleMoves: 800,
  pictures: [
    'balloon',
    'flowers',
    'mountain',
    'sand',
    'turtle',
  ],
};

const GAME_STATE = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
}

export { CONSTS as default, GAME_STATE };