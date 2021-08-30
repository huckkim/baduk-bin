import { createSolutionBuilderWithWatchHost } from 'typescript';
import { isBoardEmpty, isBoardEqual, setColor, setupBoard, hasLiberties, killGroup, Board, Coord, Color, getCoordFromBoard, getBoardFromStrings } from '../src/BadukLogic'

/** 
 *  Ensure that the setup board returns a valid board given a handicap and the proper player
 */

// - boards should be correct size
// - all boards returned should be empty or have black stones placed
// - black should be the curr player
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
  expect(isBoardEmpty(board1)).toBe(true);

  let [board2, ] = setupBoard(13, []);
  expect(isBoardEmpty(board2)).toBe(true);

  let [board3, ] = setupBoard(19, []);
  expect(isBoardEmpty(board3)).toBe(true);
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
  expect(isBoardEmpty(board1)).toBe(true);

  const handicap2 = [new Coord(3, 3), new Coord(5, 7), new Coord(8, 8)];
  let [board2, ] = setupBoard(13, handicap2);
  expect(board2[3][3]).toBe(Color.BLACK);
  expect(board2[7][5]).toBe(Color.BLACK);
  expect(board2[8][8]).toBe(Color.BLACK);
  setColor(board2, handicap2, null);
  expect(isBoardEmpty(board2)).toBe(true);

  const handicap3 = [new Coord(4, 4), new Coord(14, 14), new Coord(2, 4), new Coord(3, 0)];
  let [board3, ] = setupBoard(19, handicap3);
  expect(board3[4][4]).toBe(Color.BLACK);
  expect(board3[14][14]).toBe(Color.BLACK);
  expect(board3[4][2]).toBe(Color.BLACK);
  expect(board3[0][3]).toBe(Color.BLACK);
  setColor(board3, handicap3, null);
  expect(isBoardEmpty(board3)).toBe(true);
});

test('Getting test boards list of coords', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', 'X', '-', '-', '-', '-', 'X', 'O', '-',], // 1
    ['-', '-', 'O', '-', '-', '-', 'X', 'O', '-',], // 2
    ['-', '-', '-', 'O', 'X', '-', '-', 'X', 'O',], // 3
    ['-', '-', 'O', 'X', 'X', '-', '-', 'O', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', 'X', '-', '-', '-', 'X', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ];
  const expectedBlackMoves = [
    new Coord(1, 1), new Coord(6, 1),
    new Coord(6, 2),
    new Coord(4, 3), new Coord(7, 3),
    new Coord(3, 4), new Coord(4, 4),
    new Coord(2, 6), new Coord(6, 6)
  ];
  const expectedWhiteMoves = [
    new Coord(7, 1),
    new Coord(2, 2), new Coord(7, 2),
    new Coord(3, 3), new Coord(8, 3),
    new Coord(2, 4), new Coord(7, 4),
  ]
  const [black_moves, white_moves] = getCoordFromBoard(board);
  expect(black_moves.sort()).toEqual(expectedBlackMoves.sort());
  expect(white_moves.sort()).toEqual(expectedWhiteMoves.sort());
})

test('Get correct Board from board of string', () => {
  const eboard = [
    [null, null, null, null, null, null, null, null, null,],
    [null, Color.BLACK, null, null, null, null, Color.BLACK, Color.WHITE, null,],
    [null, null, Color.WHITE, null, null, null, Color.BLACK, Color.WHITE, null,],
    [null, null, null, Color.WHITE, Color.BLACK, null, null, Color.BLACK, Color.WHITE,],
    [null, null, Color.WHITE, Color.BLACK, Color.BLACK, null, null, Color.WHITE, null,],
    [null, null, null, null, null, null, null, null, null,],
    [null, null, Color.BLACK, null, null, null, Color.BLACK, null, null,],
    [null, null, null, null, null, null, null, null, null,],
    [null, null, null, null, null, null, null, null, null,],
  ];

  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', 'X', '-', '-', '-', '-', 'X', 'O', '-',], // 1
    ['-', '-', 'O', '-', '-', '-', 'X', 'O', '-',], // 2
    ['-', '-', '-', 'O', 'X', '-', '-', 'X', 'O',], // 3
    ['-', '-', 'O', 'X', 'X', '-', '-', 'O', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', 'X', '-', '-', '-', 'X', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ];

  const tboard = getBoardFromStrings(board);
  expect(isBoardEqual(tboard, eboard)).toEqual(true);
});
/*
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
*/

// Testing the hasLiberty functions
// - Should return true if the group connected to the stone at loc has liberties
//   and false if it doesn't
test('Single stone group, has all liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', 'X', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  const loc = new Coord(4, 2);
  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Single stone group, has no liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', 'O', '-', '-', '-', '-',], // 1
    ['-', '-', '-', 'O', 'X', 'O', '-', '-', '-',], // 2
    ['-', '-', '-', '-', 'O', '-', '-', '-', '-',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 2);

  expect(hasLiberties(tboard, loc)).toBe(false);
});

test('Single stone group, has some liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', 'O', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', 'X', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', 'O', '-', '-', '-', '-',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 2);

  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Single stone group, side, has all liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', 'O', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 8);

  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Single stone group, side, has no liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', 'X', '-', '-', '-', '-',], // 7
    ['-', '-', '-', 'X', 'O', 'X', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 8);

  expect(hasLiberties(tboard, loc)).toBe(false);
});

test('Single stone group, side, has some liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', 'X', 'O', 'X', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 8);

  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Single stone group, corner, has all liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['O', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(0, 8);

  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Single stone group, corner, has no liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['X', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['O', 'X', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(0, 8);

  expect(hasLiberties(tboard, loc)).toBe(false);
});

test('Single stone group, corner, has some liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['X', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['O', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(0, 8);

  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Medium stone group, has all liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', 'O', '-', '-', '-', '-',], // 3
    ['-', '-', '-', 'O', 'O', 'O', 'O', '-', '-',], // 4
    ['-', '-', '-', 'O', '-', '-', 'O', '-', '-',], // 5
    ['-', '-', 'O', 'O', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);

  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Medium stone group, has no liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', 'X', '-', '-', '-', '-',], // 2
    ['-', '-', '-', 'X', 'O', 'X', 'X', '-', '-',], // 3
    ['-', '-', 'X', 'O', 'O', 'O', 'O', 'X', '-',], // 4
    ['-', '-', 'X', 'O', 'X', 'X', 'O', 'X', '-',], // 5
    ['-', 'X', 'O', 'O', 'X', '-', 'X', '-', '-',], // 6
    ['-', '-', 'X', 'X', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);

  expect(hasLiberties(tboard, loc)).toBe(false);
});

test('Medium stone group, has some liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', 'X', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', 'O', 'X', 'X', '-', '-',], // 3
    ['-', '-', '-', 'O', 'O', 'O', 'O', 'X', '-',], // 4
    ['-', '-', 'X', 'O', 'X', '-', 'O', 'X', '-',], // 5
    ['-', 'X', 'O', 'O', '-', '-', 'X', '-', '-',], // 6
    ['-', '-', 'X', 'X', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);

  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Medium stone group, side, has all liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', 'O', '-', '-', '-', '-', '-', '-',], // 2
    ['O', '-', 'O', '-', '-', '-', '-', '-', '-',], // 3
    ['O', 'O', 'O', '-', '-', '-', '-', '-', '-',], // 4
    ['O', 'O', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['O', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['O', 'O', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(0, 4);

  expect(hasLiberties(tboard, loc)).toBe(true);
});
test('Medium stone group, side, has no liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', 'X', '-', '-', '-', '-', '-', '-',], // 1
    ['X', 'X', 'O', 'X', '-', '-', '-', '-', '-',], // 2
    ['O', 'X', 'O', 'X', '-', '-', '-', '-', '-',], // 3
    ['O', 'O', 'O', 'X', '-', '-', '-', '-', '-',], // 4
    ['O', 'O', 'X', '-', '-', '-', '-', '-', '-',], // 5
    ['O', 'X', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['O', 'O', 'X', '-', '-', '-', '-', '-', '-',], // 7
    ['X', 'X', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(0, 4);

  expect(hasLiberties(tboard, loc)).toBe(false);
});
test('Medium stone group, side, has some liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', 'X', '-', '-', '-', '-', '-', '-',], // 1
    ['X', '-', 'O', 'X', '-', '-', '-', '-', '-',], // 2
    ['O', 'X', 'O', 'X', '-', '-', '-', '-', '-',], // 3
    ['O', 'O', 'O', 'X', '-', '-', '-', '-', '-',], // 4
    ['O', 'O', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['O', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['O', 'O', 'X', '-', '-', '-', '-', '-', '-',], // 7
    ['X', 'X', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(0, 4);

  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Medium stone group, corner, has all liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', 'O', 'O',], // 0
    ['-', '-', '-', '-', '-', '-', '-', 'O', 'O',], // 1
    ['-', '-', '-', '-', 'O', 'O', 'O', 'O', 'O',], // 2
    ['-', '-', '-', '-', '-', '-', 'O', '-', 'O',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(8, 0);

  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Medium stone group, corner, has no liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', 'X', 'O', 'O',], // 0
    ['-', '-', '-', '-', 'X', 'X', 'X', 'O', 'O',], // 1
    ['-', '-', '-', 'X', 'O', 'O', 'O', 'O', 'O',], // 2
    ['-', '-', '-', '-', 'X', 'X', 'O', 'X', 'O',], // 3
    ['-', '-', '-', '-', '-', '-', 'X', '-', 'X',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]

  const tboard = getBoardFromStrings(board);
  let loc = new Coord(8, 0);

  expect(hasLiberties(tboard, loc)).toBe(false);
});

test('Medium stone group, corner, has some liberties', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', 'X', 'O', 'O',], // 0
    ['-', '-', '-', '-', 'X', '-', 'X', 'O', 'O',], // 1
    ['-', '-', '-', 'X', 'O', 'O', 'O', 'O', 'O',], // 2
    ['-', '-', '-', '-', 'X', '-', 'O', 'X', 'O',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', 'X',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]

  const tboard = getBoardFromStrings(board);
  let loc = new Coord(8, 0);

  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Large stone group, has all liberties', () => {

});

test('Large stone group, has no liberties', () => {

});
test('Large stone group, has some liberties', () => {

});

test.todo('Large stone group, side, has all liberties');
test.todo('Large stone group, side, has no liberties');
test.todo('Large stone group, side, has some liberties');

test.todo('Large stone group, corner, has all liberties');
test.todo('Large stone group, corner, has no liberties');
test.todo('Large stone group, corner, has some liberties');

test.todo('Multiple groups, has all liberties');
test.todo('Multiple groups, has no liberties');
test.todo('Multiple groups, has some liberties');

test('Kill single stone group', () => {
  const blackMoves = [new Coord(4, 4)];
  let [board, _] = setupBoard(9, []);
  //    
  //   0 
  //    
  setColor(board, blackMoves, Color.BLACK);
  let loc = new Coord(4, 4)
  let [nBoard, killed] = killGroup(board, loc);

  expect(killed).toBe(blackMoves.length);
  expect(isBoardEmpty(nBoard)).toBe(true);
});

test('Kill single stone group, surrounded', () => {
  const blackMoves = [new Coord(4, 4)];
  const whiteMoves = [new Coord(3, 4), new Coord(5, 4), new Coord(4, 3), new Coord(4, 5)];
  let [board, _] = setupBoard(9, []);
  //    X
  //  X 0 X
  //    X
  setColor(board, blackMoves, Color.BLACK);
  setColor(board, whiteMoves, Color.WHITE);
  let loc = new Coord(4, 4)
  let [nBoard, killed] = killGroup(board, loc);

  setColor(nBoard, whiteMoves, null);

  expect(killed).toBe(blackMoves.length);
  expect(isBoardEmpty(nBoard)).toBe(true);
});

test('Kill medium stone group', () => {
  const blackMoves = [
    new Coord(4, 4), new Coord(4, 5), new Coord(4, 6), new Coord(4, 7), new Coord(4, 8),
    new Coord(3, 3), new Coord(3, 4), new Coord(3, 5), new Coord(3, 6),
  ];
  let [board, _] = setupBoard(13, []);

  setColor(board, blackMoves, Color.BLACK);
  let loc = new Coord(4, 4);
  let [nBoard, killed] = killGroup(board, loc);

  expect(killed).toBe(blackMoves.length);
  expect(isBoardEmpty(nBoard)).toBe(true);
});

test('Kill medium stone group, surrounded', () => {
  const blackMoves = [
    new Coord(4, 4), new Coord(4, 5), new Coord(4, 6), new Coord(4, 7), new Coord(4, 8),
    new Coord(3, 3), new Coord(3, 4), new Coord(3, 5), new Coord(3, 6),
  ];
  const whiteMoves = [
    new Coord(3,2), new Coord(2,3), new Coord(4,3),
    new Coord(2,4), new Coord(5,4),
    new Coord(2,5), new Coord(5,5),
    new Coord(2,6), new Coord(5,6),
    new Coord(3,7), new Coord(5,7),
    new Coord(3,8), new Coord(5,8),
    new Coord(4,9)
  ]
  let [board, _] = setupBoard(13, []);
  //   X
  // X O X
  // X O O X
  // X O O X
  // X O O X
  //   X O X
  //   X O X
  //     X

  setColor(board, blackMoves, Color.BLACK);
  setColor(board, whiteMoves, Color.WHITE);
  let loc = new Coord(4, 4);
  let [nBoard, killed] = killGroup(board, loc);

  setColor(board, whiteMoves, null);

  expect(killed).toBe(blackMoves.length);
  expect(isBoardEmpty(nBoard)).toBe(true);
});

test('Kill large stone group', () => {
  const blackMoves = [
    new Coord(5,0), new Coord(6,0), new Coord(7,0),
    new Coord(5,1), new Coord(6,1), new Coord(7,1),
    new Coord(6,2), new Coord(7,2), new Coord(8,2),
    new Coord(7,3),
    new Coord(7,4), new Coord(8,4), new Coord(9,4),
    new Coord(7,5), new Coord(9,5),
    new Coord(9,6), new Coord(10,6), new Coord(11,6),
    new Coord(10,7), new Coord(11,7), 
    new Coord(10,8), new Coord(11,8), 
    new Coord(7,9), new Coord(8,9), new Coord(9,9), new Coord(10,9), new Coord(11,9), new Coord(12,9), new Coord(13,9),
    new Coord(7,10), new Coord(8,10), new Coord(9,10), new Coord(10,10), new Coord(12,10), new Coord(13,10),
    new Coord(8,11), new Coord(9,11), new Coord(10,11), 
    new Coord(10,12),
    new Coord(10,13),
  ];
  let [board, _] = setupBoard(19, []);

  setColor(board, blackMoves, Color.BLACK);
  let loc = new Coord(7, 3);
  let [nBoard, killed] = killGroup(board, loc);

  expect(killed).toBe(blackMoves.length);
  expect(isBoardEmpty(nBoard)).toBe(true);

});
test('Kill large stone group, surrounded', () => {

  const blackMoves = [
    new Coord(5,0), new Coord(6,0), new Coord(7,0),
    new Coord(5,1), new Coord(6,1), new Coord(7,1),
    new Coord(6,2), new Coord(7,2), new Coord(8,2),
    new Coord(7,3),
    new Coord(7,4), new Coord(8,4), new Coord(9,4),
    new Coord(7,5), new Coord(9,5),
    new Coord(9,6), new Coord(10,6), new Coord(11,6),
    new Coord(10,7), new Coord(11,7), 
    new Coord(10,8), new Coord(11,8), 
    new Coord(7,9), new Coord(8,9), new Coord(9,9), new Coord(10,9), new Coord(11,9), new Coord(12,9), new Coord(13,9),
    new Coord(7,10), new Coord(8,10), new Coord(9,10), new Coord(10,10), new Coord(12,10), new Coord(13,10),
    new Coord(8,11), new Coord(9,11), new Coord(10,11), 
    new Coord(10,12),
    new Coord(10,13),
  ];
  const whiteMoves = [
  ]
  let [board, _] = setupBoard(19, []);

  setColor(board, blackMoves, Color.BLACK);
  setColor(board, whiteMoves, Color.WHITE);
  let loc = new Coord(7, 3);
  let [nBoard, killed] = killGroup(board, loc);

  setColor(board, whiteMoves, null);

  expect(killed).toBe(blackMoves.length);
  expect(isBoardEmpty(nBoard)).toBe(true);
});

test.todo('Normal board, dead group');
