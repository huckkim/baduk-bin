import {Board, Coord, Color } from '../src/shared/types'
import { isBoardEmpty, isBoardEqual, setColor, getCoordFromBoard, getBoardFromStrings, findBorderingColor, alphaToCoord, getStringsFromBoard, cloneBoard } from '../src/BoardLogic/helper'
import BadukGame from '../src/BoardLogic/BadukGame'
import { findSpaceSize,  setupBoard, hasLiberties, killGroup, killSurroundingGroups,   calculateTerritory, } from '../src/BoardLogic/BadukGame'
import exp from 'constants';

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
   or
  
  const board = [
    ['---------'], // 0
    ['---------'], // 1
    ['---------'], // 2
    ['---------'], // 3
    ['---------'], // 4
    ['---------'], // 5
    ['---------'], // 6
    ['---------'], // 7
    ['---------'], // 8
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

test('Multiple groups, has all liberties', () => {
  const board = [
    ['-', '-', 'X', '-', '-', '-', '-', 'O', 'O',], // 0
    ['-', '-', 'X', '-', '-', '-', '-', 'X', 'X',], // 1
    ['-', '-', 'X', '-', '-', '-', '-', '-', '-',], // 2
    ['-', 'X', '-', '-', 'O', '-', '-', '-', '-',], // 3
    ['-', 'X', '-', 'O', 'O', 'O', 'O', '-', '-',], // 4
    ['-', 'X', '-', 'O', '-', '-', 'O', '-', '-',], // 5
    ['-', '-', 'O', 'O', '-', 'O', '-', 'O', 'X',], // 6
    ['-', 'X', '-', '-', 'X', '-', '-', 'X', '-',], // 7
    ['-', '-', '-', 'O', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);

  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Multiple groups, has no liberties', () => {
  const board = [
    ['-', '-', 'X', '-', '-', '-', '-', 'O', 'O',], // 0
    ['-', '-', 'X', '-', '-', '-', '-', 'X', 'X',], // 1
    ['-', '-', 'X', '-', 'X', '-', '-', '-', '-',], // 2
    ['-', 'X', '-', 'X', 'O', 'X', 'X', '-', '-',], // 3
    ['-', 'X', 'X', 'O', 'O', 'O', 'O', 'X', '-',], // 4
    ['-', 'X', 'X', 'O', 'X', 'X', 'O', 'X', '-',], // 5
    ['-', 'X', 'O', 'O', 'X', 'O', 'X', '-', 'X',], // 6
    ['-', 'X', 'X', 'X', 'X', '-', '-', 'X', '-',], // 7
    ['-', '-', '-', 'O', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);

  expect(hasLiberties(tboard, loc)).toBe(false);
});

test('Multiple groups, has some liberties', () => {
  const board = [
    ['-', '-', 'X', '-', '-', '-', '-', 'O', 'O',], // 0
    ['-', '-', 'X', '-', '-', '-', '-', 'X', 'X',], // 1
    ['-', '-', 'X', '-', 'X', '-', '-', '-', '-',], // 2
    ['-', 'X', '-', 'X', 'O', 'X', 'X', '-', '-',], // 3
    ['-', 'X', 'X', 'O', 'O', 'O', 'O', 'X', '-',], // 4
    ['-', 'X', 'X', 'O', '-', 'X', 'O', 'X', '-',], // 5
    ['-', 'X', 'O', 'O', 'X', 'O', 'X', '-', 'X',], // 6
    ['-', 'X', 'X', 'X', 'X', '-', '-', 'X', '-',], // 7
    ['-', '-', '-', 'O', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);

  expect(hasLiberties(tboard, loc)).toBe(true);
});

test('Kill single stone group', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 3
    ['-', '-', '-', '-', 'X', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const eboard = [
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
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);
  let [fboard, killed] = killGroup(tboard, loc);
  const cboard = getBoardFromStrings(eboard);
  expect(isBoardEqual(fboard, cboard)).toBe(true);
  expect(killed).toBe(1);
});

test('Kill single stone group, surrounded', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', 'O', '-', '-', '-', '-',], // 3
    ['-', '-', '-', 'O', 'X', 'O', '-', '-', '-',], // 4
    ['-', '-', '-', '-', 'O', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const eboard = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', 'O', '-', '-', '-', '-',], // 3
    ['-', '-', '-', 'O', '-', 'O', '-', '-', '-',], // 4
    ['-', '-', '-', '-', 'O', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);
  let [fboard, killed] = killGroup(tboard, loc);
  const cboard = getBoardFromStrings(eboard);
  expect(isBoardEqual(fboard, cboard)).toBe(true);
  expect(killed).toBe(1);
});

test('Kill medium stone group', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', 'X', '-', '-', '-',], // 2
    ['-', '-', 'X', 'X', 'X', 'X', 'X', '-', '-',], // 3
    ['-', '-', 'X', 'X', 'X', '-', '-', '-', '-',], // 4
    ['-', '-', 'X', '-', 'X', 'X', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const eboard = [
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
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);
  let [fboard, killed] = killGroup(tboard, loc);
  const cboard = getBoardFromStrings(eboard);
  expect(isBoardEqual(fboard, cboard)).toBe(true);
  expect(killed).toBe(12);
});

test('Kill medium stone group, surrounded', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', 'O', '-', '-', '-',], // 1
    ['-', '-', 'O', 'O', 'O', 'X', 'O', '-', '-',], // 2
    ['-', 'O', 'X', 'X', 'X', 'X', 'X', 'O', '-',], // 3
    ['-', 'O', 'X', 'X', 'X', 'O', 'O', '-', '-',], // 4
    ['-', 'O', 'X', 'O', 'X', 'X', 'O', '-', '-',], // 5
    ['-', '-', 'O', '-', 'O', 'O', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const eboard = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', 'O', '-', '-', '-',], // 1
    ['-', '-', 'O', 'O', 'O', '-', 'O', '-', '-',], // 2
    ['-', 'O', '-', '-', '-', '-', '-', 'O', '-',], // 3
    ['-', 'O', '-', '-', '-', 'O', 'O', '-', '-',], // 4
    ['-', 'O', '-', 'O', '-', '-', 'O', '-', '-',], // 5
    ['-', '-', 'O', '-', 'O', 'O', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);
  let [fboard, killed] = killGroup(tboard, loc);
  const cboard = getBoardFromStrings(eboard);
  expect(isBoardEqual(fboard, cboard)).toBe(true);
  expect(killed).toBe(12);
});

test('Kill large stone group', () => {
});

test('Kill large stone group, surrounded', () => {
});

test('Kill corner, stone group', () => {
  const board = [
    ['O', 'X', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['O', 'O', 'X', '-', '-', '-', '-', '-', '-',], // 1
    ['X', 'X', '-', '-', 'O', '-', '-', '-', '-',], // 2
    ['-', '-', '-', 'X', '-', '-', '-', '-', '-',], // 3
    ['-', '-', 'X', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', 'O', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ];
  const eboard = [
    ['-', 'X', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', 'X', '-', '-', '-', '-', '-', '-',], // 1
    ['X', 'X', '-', '-', 'O', '-', '-', '-', '-',], // 2
    ['-', '-', '-', 'X', '-', '-', '-', '-', '-',], // 3
    ['-', '-', 'X', '-', '-', '-', '-', '-', '-',], // 4
    ['-', '-', '-', '-', 'O', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ];
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(0, 0);
  let [fboard, killed] = killGroup(tboard, loc);
  const cboard = getBoardFromStrings(eboard);
  expect(isBoardEqual(fboard, cboard)).toBe(true);
  expect(killed).toBe(3);
})

test('Normal board, dead group', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', 'X', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', 'X', '-', 'X', 'X', 'O', 'O', 'X', '-', '-', '-'],
    ['-', '-', 'X', '-', 'X', 'O', 'X', 'O', 'X', 'X', '-', 'O', '-'],
    ['-', '-', 'O', 'O', 'X', 'O', 'O', 'X', 'X', '-', 'X', '-', '-'],
    ['-', '-', '-', 'O', 'O', 'X', 'X', 'O', '-', 'X', '-', '-', '-'],
    ['-', '-', '-', '-', 'X', 'O', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', 'O', '-', 'O', '-', '-', '-', '-', '-', 'O', '-'],
    ['-', '-', '-', 'O', '-', '-', '-', '-', '-', 'O', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', 'O', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
  ]
  const eboard = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'], // 0-
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'], // 1
    ['-', '-', '-', '-', '-', 'X', '-', '-', '-', '-', '-', '-', '-'], // 2
    ['-', '-', '-', 'X', '-', 'X', 'X', 'O', 'O', 'X', '-', '-', '-'], // 3
    ['-', '-', 'X', '-', 'X', '-', 'X', 'O', 'X', 'X', '-', 'O', '-'], // 4
    ['-', '-', 'O', 'O', 'X', '-', '-', 'X', 'X', '-', 'X', '-', '-'], // 5
    ['-', '-', '-', 'O', 'O', 'X', 'X', 'O', '-', 'X', '-', '-', '-'], // 6
    ['-', '-', '-', '-', 'X', 'O', '-', '-', '-', '-', '-', '-', '-'], // 7
    ['-', '-', '-', 'O', '-', 'O', '-', '-', '-', '-', '-', 'O', '-'], // 8
    ['-', '-', '-', 'O', '-', '-', '-', '-', '-', 'O', '-', '-', '-'], // 9
    ['-', '-', '-', '-', '-', '-', 'O', '-', '-', '-', '-', '-', '-'], // 10
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'], // 11
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'], // 12
    //0    1    2    3    4    5    6    7    8    9    10   11   12
  ]
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(5, 4);
  let [fboard, killed] = killGroup(tboard, loc);
  const cboard = getBoardFromStrings(eboard);
  expect(isBoardEqual(fboard, cboard)).toBe(true);
  expect(killed).toBe(3);
});

test('kill surrounding groups single stone', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', 'X', '-', '-', '-', '-',], // 2
    ['-', '-', '-', 'X', 'O', 'X', '-', '-', '-',], // 3
    ['-', '-', 'X', 'O', 'X', 'O', 'X', '-', '-',], // 4
    ['-', '-', '-', 'X', 'O', 'X', '-', '-', '-',], // 5
    ['-', '-', '-', '-', 'X', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ];
  const eboard = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', 'X', '-', '-', '-', '-',], // 2
    ['-', '-', '-', 'X', '-', 'X', '-', '-', '-',], // 3
    ['-', '-', 'X', '-', 'X', '-', 'X', '-', '-',], // 4
    ['-', '-', '-', 'X', '-', 'X', '-', '-', '-',], // 5
    ['-', '-', '-', '-', 'X', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ];
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);
  let [fboard, killed] = killSurroundingGroups(tboard, loc);
  const cboard = getBoardFromStrings(eboard);
  expect(isBoardEqual(fboard, cboard)).toBe(true);
  expect(killed).toBe(4);
});

test('kill surrounding groups, larger group', () => {
  const board = [
    ['-', '-', 'O', 'X', 'X', 'O', '-', '-', '-',], // 0
    ['-', '-', 'O', 'X', 'X', 'O', '-', '-', '-',], // 1
    ['-', '-', '-', 'O', 'X', 'O', '-', '-', '-',], // 2
    ['-', '-', 'O', 'X', 'O', 'X', 'O', '-', '-',], // 3
    ['-', '-', 'O', 'X', 'O', 'X', 'X', 'O', '-',], // 4
    ['-', '-', '-', 'O', 'O', 'X', 'X', 'O', '-',], // 5
    ['-', '-', '-', '-', 'O', 'X', 'X', 'O', '-',], // 6
    ['-', '-', '-', '-', '-', 'O', 'O', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ];
  const eboard = [
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
  const tboard = getBoardFromStrings(board);
  let loc = new Coord(4, 4);
  let [fboard, killed] = killSurroundingGroups(tboard, loc);
  const cboard = getBoardFromStrings(eboard);
  expect(isBoardEqual(fboard, cboard)).toBe(true);
  expect(killed).toBe(14);
});

test('territory, 1 space', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', '-', 'X', '-', '-', '-', '-',], // 3
    ['-', '-', '-', 'X', '-', 'X', '-', '-', '-',], // 4
    ['-', '-', '-', '-', 'X', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  let loc = new Coord(4, 4);
  let nboard = getBoardFromStrings(board);
  let size = findSpaceSize(nboard, loc);
  expect(size).toBe(1);
})

test('calculate basic territory', () => {
  const board = [
    ['-', '-', '-', '-', 'X', 'O', '-', '-', '-',], // 0
    ['-', '-', '-', '-', 'X', 'O', '-', '-', '-',], // 1
    ['-', '-', '-', '-', 'X', 'O', '-', '-', '-',], // 2
    ['-', '-', '-', '-', 'X', 'O', '-', '-', '-',], // 3
    ['-', '-', '-', '-', 'X', 'O', '-', '-', '-',], // 4
    ['-', '-', '-', '-', 'X', 'O', '-', '-', '-',], // 5
    ['-', '-', '-', '-', 'X', 'O', '-', '-', '-',], // 6
    ['-', '-', '-', '-', 'X', 'O', '-', '-', '-',], // 7
    ['-', '-', '-', '-', 'X', 'O', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  let tboard = getBoardFromStrings(board);
  let [black_territory, white_territory] = calculateTerritory(tboard);
  expect(black_territory).toBe(36);
  expect(white_territory).toBe(27);
})

test('create new game, no handicap, correct state', () => {
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
  const eboard = getBoardFromStrings(board);
  let game = new BadukGame(9, [], 6.5);
  expect(game.curr_player).toBe(Color.BLACK);
  expect(game.has_passed).toBe(false);
  expect(game.prev_board).toBe(null);
  expect(game.black_captures).toBe(0);
  expect(game.white_captures).toBe(0);
  expect(isBoardEqual(game.board, eboard)).toBe(true);
});

test('create new game, with handicap, correct state', () => {
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
  const eboard = getBoardFromStrings(board);
  const [black_coords,] = getCoordFromBoard(eboard);
  let game = new BadukGame(9, black_coords, 6.5);
  expect(game.curr_player).toBe(Color.WHITE);
  expect(game.has_passed).toBe(false);
  expect(game.prev_board).toBe(null);
  expect(game.black_captures).toBe(0);
  expect(game.white_captures).toBe(0);
  expect(isBoardEqual(game.board, eboard)).toBe(true);
});

test('play game, single move, change next player', () => {
  let game = new BadukGame(9, [], 0.5);
  expect(game.curr_player).toBe(Color.BLACK);
  let [valid1, ] = game.playMove(alphaToCoord("D5"), game.curr_player)
  expect(valid1).toBe(true);
  expect(game.curr_player).toBe(Color.WHITE);
  let [valid2, ] = game.playMove(alphaToCoord("G7"), game.curr_player)
  expect(valid2).toBe(true);
})

test('play full game, expect correct score', () => {
  let game = new BadukGame(9, [], 0);
  // https://online-go.com/game/697808 + endgame moves
  const moves = [
    "E5", "C7", "C6", "B6", "D7", "D8", "D6", "B8", "B5", "F7",
    "A6", "B7", "G7", "F8", "F6", "E3", "D2", "D3", "C3", "E2",
    "G3", "C2", "B2", "D1", "B3", "G2", "H2", "F3", "H3", "H1",
    "G8", "G4", "H4", "G5", "H5", "F4", "G9", "G6", "H6", "D4",
    "C4", "F9", "B9", "C8", "D9", "E8", "B1", "C1", "A7", "A8",
    "A5", "C9", "J2",
    "G1" // endgame move from white
  ];
  for (let i = 0; i < moves.length; ++i){
    let [valid, ] = game.playMove(alphaToCoord(moves[i]), game.curr_player)
    expect(valid).toBe(true);
  }
  game.removeGroup(alphaToCoord("B9"));
  game.removeGroup(alphaToCoord("D9"));
  expect(game.black_captures).toBe(0);
  expect(game.white_captures).toBe(3);
  game.playMove(null, game.curr_player);
  game.playMove(null, game.curr_player);
  let [black_score, white_score, msg] = game.calculateTerritory();
  const winner = black_score > white_score ? Color.BLACK : Color.WHITE;
  expect(winner).toBe(Color.BLACK);
  expect(black_score).toBe(15);
  expect(white_score).toBe(11);
});

test.only('start game, invalid ko move', () => {
  const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 0
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 1
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 2
    ['-', '-', '-', 'X', 'O', '-', '-', '-', '-',], // 3
    ['-', '-', 'X', 'O', '-', 'O', '-', '-', '-',], // 4
    ['-', '-', '-', 'X', 'O', '-', '-', '-', '-',], // 5
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 6
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 7
    ['-', '-', '-', '-', '-', '-', '-', '-', '-',], // 8
    //0    1    2    3    4    5    6    7    8
  ]
  const eboard = getBoardFromStrings(board);
  let game = new BadukGame(9, [], 0);
  game.board = eboard;

  expect(game.curr_player = Color.BLACK);
  let [valid1,] = game.playMove(new Coord(4, 4), game.curr_player);
  expect(valid1).toBe(true);
  console.log(getStringsFromBoard(game.prev_board));

  expect(game.curr_player).toBe(Color.WHITE);
  let [valid2,] = game.playMove(new Coord(3, 4), game.curr_player);
  expect(valid2).toBe(true);
  console.log(getStringsFromBoard(game.prev_board))


  expect(game.curr_player = Color.BLACK);
  let [valid3,] = game.playMove(new Coord(4, 4), game.curr_player);
  console.log(getStringsFromBoard(game.prev_board))
  expect(valid3).toBe(false);

});

test('start game, invalid move already stone there', () => {
  let game = new BadukGame(9, [], 0.5);
  expect(game.curr_player).toBe(Color.BLACK);
  let [valid1, ] = game.playMove(alphaToCoord("D5"), game.curr_player)
  expect(valid1).toBe(true);
  expect(game.curr_player).toBe(Color.WHITE);
  let [valid2, msg] = game.playMove(alphaToCoord("D5"), game.curr_player)
  expect(valid2).toBe(false);
})

test('start game, invalid suicide move', () => {

});
