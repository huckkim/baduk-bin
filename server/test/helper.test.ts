import { Coord, Color} from '../src/shared/types'
import { isBoardEmpty, isBoardEqual, setColor, getCoordFromBoard, getBoardFromStrings, findBorderingColor, alphaToCoord, getStringsFromBoard, cloneBoard } from '../src/BoardLogic/helper'

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
  const [black_moves, white_moves] = getCoordFromBoard(getBoardFromStrings(board));
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

test('alpha to coord 9x9 test', () => {
  expect(alphaToCoord("A1")).toStrictEqual(new Coord(0, 0));
  expect(alphaToCoord("B6")).toStrictEqual(new Coord(1, 5));
  expect(alphaToCoord("C3")).toStrictEqual(new Coord(2, 2));
  expect(alphaToCoord("D2")).toStrictEqual(new Coord(3, 1));
  expect(alphaToCoord("H9")).toStrictEqual(new Coord(7, 8));
  // For some reason North American Go board coordinates omit I
  // probably because it looks like a 1
  expect(alphaToCoord("J7")).toStrictEqual(new Coord(8, 6));
});

test('clone board test', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', 'X', '-', '-', '-', 'X', '-', '-',], // 2
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 3
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', 'X', '-', '-', '-', 'X', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  let tboard = getBoardFromStrings(board);
  let copyboard = cloneBoard(tboard);
  copyboard[0][0] = Color.WHITE;
  expect(tboard[0][0]).toBe(null);

  tboard[0][0] = Color.BLACK;
  expect(copyboard[0][0]).toBe(Color.WHITE);
})

test('function bordering color white', () => {
  const board = [
    ['-', '-', 'O', '-', '-', 'O', '-', '-', '-',], // 0
    ['-', '-', 'O', '-', '-', 'O', '-', '-', '-',], // 1
    ['-', '-', '-', 'O', '-', 'O', '-', '-', '-',], // 2
    ['-', '-', 'O', '-', 'O', '-', 'O', '-', '-',], // 3
    ['-', '-', 'O', '-', 'O', '-', '-', 'O', '-',], // 4
    ['-', '-', '-', 'O', 'O', '-', '-', 'O', '-',], // 5
    ['-', '-', '-', '-', 'O', '-', '-', 'O', '-',], // 6
    ['-', '-', '-', '-', '-', 'O', 'O', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ];
  let tboard = getBoardFromStrings(board);
  let loc = new Coord(5, 5);
  let color = findBorderingColor(tboard, loc);
  expect(color).toBe(Color.WHITE);
});

test('function bordering color black, center', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', 'O', '-', '-',], // 0
    ['-', 'O', '-', '-', '-', 'X', 'O', '-', '-',], // 1
    ['-', '-', 'X', 'X', 'X', '-', 'X', 'O', '-',], // 2
    ['-', 'X', '-', '-', '-', '-', '-', 'X', 'O',], // 3
    ['-', 'X', '-', '-', '-', 'X', 'X', '-', '-',], // 4
    ['-', 'X', '-', 'X', '-', '-', 'X', '-', '-',], // 5
    ['-', '-', 'X', '-', 'X', 'X', '-', '-', '-',], // 6
    ['-', 'O', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  let tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);
  let color = findBorderingColor(tboard, loc);
  expect(color).toBe(Color.BLACK);
});

test('function bordering color white, corner', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', 'O', '-', '-',], // 0
    ['-', 'O', '-', '-', '-', 'X', 'O', '-', '-',], // 1
    ['-', '-', 'X', 'X', 'X', '-', 'X', 'O', '-',], // 2
    ['-', 'X', '-', '-', '-', '-', '-', 'X', 'O',], // 3
    ['-', 'X', '-', '-', '-', 'X', 'X', '-', '-',], // 4
    ['-', 'X', '-', 'X', '-', '-', 'X', '-', '-',], // 5
    ['-', '-', 'X', '-', 'X', 'X', '-', '-', '-',], // 6
    ['-', 'O', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  let tboard = getBoardFromStrings(board);
  let loc = new Coord(8, 0);
  let color = findBorderingColor(tboard, loc);
  expect(color).toBe(Color.WHITE);
});
