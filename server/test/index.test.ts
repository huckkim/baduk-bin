import { sum, setupBoard, hasLiberties, Board, Coord, Color } from '../src/index'

test(' add 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

function isEmpty(board: Board): boolean {
  for (const row of board) {
    for (const space of row) {
      if (space != null) return false;
    }
  }
  return true;
}

function setColor(board: Board, moves: Array<Coord>, curr_player: Color | null): Board {
  moves.forEach((move) => {
    board[move.y][move.x] = curr_player;
  });
  return board;
};

test('Setup Board, no handicap, expect black to play', () => {
  let [ , curr_player1] = setupBoard(9, []);
  expect(curr_player1).toBe(Color.BLACK);

  let [ , curr_player2] = setupBoard(13, []);
  expect(curr_player2).toBe(Color.BLACK);

  let [ , curr_player3] = setupBoard(19, []);
  expect(curr_player3).toBe(Color.BLACK);
});

test('Setup Board, no handicap, expect empty board', () => {
  let [board1, ] = setupBoard(9, []);
  expect(isEmpty(board1)).toBe(true);

  let [board2, ] = setupBoard(13, []);
  expect(isEmpty(board2)).toBe(true);

  let [board3, ] = setupBoard(19, []);
  expect(isEmpty(board3)).toBe(true);
});

test('Setup Board, no handicap, expect correct board sizes', () => {
  let [board1, ] = setupBoard(9, []);
  expect(board1.length).toBe(9);
  board1.forEach((row) => { expect(row.length).toBe(9); });

  let [board2, ] = setupBoard(13, []);
  expect(board2.length).toBe(13);
  board2.forEach((row) => { expect(row.length).toBe(13); });

  let [board3, ] = setupBoard(19, []);
  expect(board3.length).toBe(19);
  board3.forEach((row) => { expect(row.length).toBe(19); });
});

test('Setup Board, handicap, expect white to play', () => {
  let [, curr_player1] = setupBoard(9, [new Coord(2, 2)]);
  expect(curr_player1).toBe(Color.WHITE);

  let [, curr_player2] = setupBoard(13, [new Coord(3, 3)]);
  expect(curr_player2).toBe(Color.WHITE);

  let [, curr_player3] = setupBoard(19, [new Coord(4, 4)]);
  expect(curr_player3).toBe(Color.WHITE);
});

test('Setup Board, handicap, expect correct board', () => {
  const handicap1 = [new Coord(2, 2), new Coord(4, 5)];
  let [board1, ] = setupBoard(9, handicap1);
  expect(board1[2][2]).toBe(Color.BLACK);
  expect(board1[5][4]).toBe(Color.BLACK);
  setColor(board1, handicap1, null);
  expect(isEmpty(board1)).toBe(true);

  const handicap2 = [new Coord(3, 3), new Coord(5, 7), new Coord(8, 8)];
  let [board2, ] = setupBoard(13, handicap2);
  expect(board2[3][3]).toBe(Color.BLACK);
  expect(board2[7][5]).toBe(Color.BLACK);
  expect(board2[8][8]).toBe(Color.BLACK);
  setColor(board2, handicap2, null);
  expect(isEmpty(board2)).toBe(true);

  const handicap3 = [new Coord(4, 4), new Coord(14, 14), new Coord(2, 4), new Coord(3, 0)];
  let [board3, ] = setupBoard(19, handicap3);
  expect(board3[4][4]).toBe(Color.BLACK);
  expect(board3[14][14]).toBe(Color.BLACK);
  expect(board3[4][2]).toBe(Color.BLACK);
  expect(board3[0][3]).toBe(Color.BLACK);
  setColor(board3, handicap3, null);
  expect(isEmpty(board3)).toBe(true);
});

test('Single stone group, has all liberties', () => {
  let [board, _] = setupBoard(9, []);
  //     
  //   0
  // 
  board[4][4] = Color.BLACK;
  let loc = new Coord(4, 4);

  expect(hasLiberties(board, loc)).toBe(true);
});

test('Single stone group, no liberties', () => {
  const blackMoves = [new Coord(4, 4)];
  const whiteMoves = [new Coord(3, 4), new Coord(5, 4), new Coord(4, 3), new Coord(4, 5)];
  let [board, _] = setupBoard(9, []);
  //    X
  //  X 0 X
  //    X
  setColor(board, blackMoves, Color.BLACK);
  setColor(board, whiteMoves, Color.WHITE);
  let loc = new Coord(4, 4);

  expect(hasLiberties(board, loc)).toBe(false);
});

test('Single stone group, some liberties', () => {
  const blackMoves = [new Coord(4, 4)];
  const whiteMoves = [new Coord(4, 3), new Coord(4, 5)];
  let [board, _] = setupBoard(9, []);
  //    X
  //    0 
  //    X
  setColor(board, blackMoves, Color.BLACK);
  setColor(board, whiteMoves, Color.WHITE);
  let loc = new Coord(4, 4);

  expect(hasLiberties(board, loc)).toBe(true);
});

test('Single stone group, side, has all liberties', () => {
  const blackMoves = [new Coord(4, 0)];
  let [board, _] = setupBoard(9, []);
  //    
  //    0 
  // ------- 
  setColor(board, blackMoves, Color.BLACK);
  let loc = new Coord(4, 0);

  expect(hasLiberties(board, loc)).toBe(true);
});

test('Single stone group, side, has no liberties', () => {
  const blackMoves = [new Coord(4, 0)];
  const whiteMoves = [new Coord(3, 0), new Coord(5, 0), new Coord(4, 1)];
  let [board, _] = setupBoard(9, []);
  //    X
  //  X 0 X
  // -------
  setColor(board, blackMoves, Color.BLACK);
  setColor(board, whiteMoves, Color.WHITE);
  let loc = new Coord(4, 0);

  expect(hasLiberties(board, loc)).toBe(false);
});

test('Single stone group, side, has some liberties', () => {
  const blackMoves = [new Coord(4, 0)];
  const whiteMoves = [new Coord(5, 0), new Coord(4, 1)];
  let [board, _] = setupBoard(9, []);
  //    X
  //    0 X
  // -------
  setColor(board, blackMoves, Color.BLACK);
  setColor(board, whiteMoves, Color.WHITE);
  let loc = new Coord(4, 0);

  expect(hasLiberties(board, loc)).toBe(true);
});

test('Single stone group, corner, has all liberties', () => {
  const blackMoves = [new Coord(8, 8)];
  let [board, _] = setupBoard(9, []);
  // -------
  //    0  |
  //       |
  setColor(board, blackMoves, Color.BLACK);
  let loc = new Coord(8, 8);

  expect(hasLiberties(board, loc)).toBe(true);
});

test('Single stone group, corner, has some liberties', () => {
  const blackMoves = [new Coord(8, 8)];
  const whiteMoves = [new Coord(7, 8)];
  let [board, _] = setupBoard(9, []);
  // -------
  //  X 0  |
  //       |
  setColor(board, blackMoves, Color.BLACK);
  setColor(board, whiteMoves, Color.WHITE);
  let loc = new Coord(8, 8);

  expect(hasLiberties(board, loc)).toBe(true);
});

test('Single stone group, corner, has no liberties', () => {
  const blackMoves = [new Coord(8, 8)];
  const whiteMoves = [new Coord(7, 8), new Coord(8, 7)];
  let [board, _] = setupBoard(9, []);
  // -------
  //  X 0  |
  //    X  |
  setColor(board, blackMoves, Color.BLACK);
  setColor(board, whiteMoves, Color.WHITE);
  let loc = new Coord(8, 8);

  expect(hasLiberties(board, loc)).toBe(false);
});

test('Medium stone group, has all liberties', () => {
  const blackMoves = [
    new Coord(4, 4), new Coord(4, 5), new Coord(4, 6), new Coord(4, 7), new Coord(4, 8),
    new Coord(3, 3), new Coord(3, 4), new Coord(3, 5), new Coord(3, 6),
  ];

  let [board, _] = setupBoard(13, []);

  setColor(board, blackMoves, Color.BLACK);
  let loc = new Coord(4, 4);

  expect(hasLiberties(board, loc)).toBe(true);
});

test('Medium stone group, has no liberties', () => {
  const blackMoves = [
    new Coord(4, 4), new Coord(4, 5), new Coord(4, 6), new Coord(4, 7), new Coord(4, 8),
    new Coord(3, 3), new Coord(3, 4), new Coord(3, 5), new Coord(3, 6),
  ];
  const whiteMoves = [
  ];

  let [board, _] = setupBoard(13, []);

  setColor(board, blackMoves, Color.BLACK);
  setColor(board, whiteMoves, Color.WHITE);
  let loc = new Coord(4, 4);

  expect(hasLiberties(board, loc)).toBe(true);
});

test('Medium stone group, has some liberties', () => {

});
