export enum Color {
  BLACK,
  WHITE
};

export type Board = Array<Array<null | Color>>;

export class Coord {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

/* ----------------------------- UTILITY ----------------------------- */

/**
 * @param board1 
 * @param board2 
 * @returns if board1 and board2 represent the same state
 */
export function isBoardEqual(board1: Board, board2: Board): boolean {
  for (let i = 0; i < board1.length; ++i){
    for (let j = 0; j < board1.length; ++j){
      if (board1[i][j] != board2[i][j]) return false;
    }
  }
  return true;
}

/**
 * @param board 
 * @returns return if board is empty (has no stones)
 */
export function isBoardEmpty(board: Board): boolean {
  for (const row of board) {
    for (const space of row) {
      if (space != null) return false;
    }
  }
  return true;
}

/**
 * sets each of the Coords given in moves to curr_player in board
 * @param board 
 * @param moves Array of Coords to place stone
 * @param curr_player 
 * @returns 
 */
export function setColor(board: Board, moves: Array<Coord>, curr_player: Color | null): Board {
  moves.forEach((move) => {
    board[move.y][move.x] = curr_player;
  });
  return board;
};

/**
 * pre: board at loc != null
 * @param board 
 * @param loc 
 * @return a Board with only the group connected to the stone at loc placed
 */
function selectGroup(board: Board, loc: Coord): Board{
  let toVisit = [loc];
  let curr_player = board[loc.y][loc.x];
  let checkGraph = Array<Array<String>>(board.length).fill(null).map(() => { return new Array<String>(board.length).fill("N") });
  let size = board.length;
  let nboard = new Array<Array<null | Color>>(size).fill(null).map(() => { return new Array<null | Color>(size).fill(null) });
  while (toVisit.length != 0) {
    let curr = toVisit.pop();
    if (checkGraph[curr.y][curr.x] == "N") {
      nboard[curr.y][curr.x] = curr_player;
      if (board[curr.y][curr.x] == curr_player) {
        if (curr.y + 1 < board.length)
          toVisit.push(new Coord(curr.x, curr.y + 1));
        if (curr.y - 1 >= 0)
          toVisit.push(new Coord(curr.x, curr.y - 1));
        if (curr.x + 1 < board.length)
          toVisit.push(new Coord(curr.x + 1, curr.y));
        if (curr.x - 1 >= 0)
          toVisit.push(new Coord(curr.x - 1, curr.y));
      }
      checkGraph[curr.y][curr.x] = "D";
    }
  }
  return nboard;
}

/*----------------------------- GAME LOGIC ----------------------------- */

/**
 * setup Board with proper size and handicap 
 * @param size 
 * @param handicap 
 * @returns Board object and color of player to move
 */
export function setupBoard(size: number, handicap: Array<Coord>): [Board, Color] {
  let board = new Array<Array<null | Color>>(size).fill(null).map(() => { return new Array<null | Color>(size).fill(null) });
  if (handicap.length == 0) {
    return [board, Color.BLACK];
  }
  handicap.forEach((coord: Coord) => { board[coord.y][coord.x] = Color.BLACK });
  return [board, Color.WHITE];
}

/**
 * pre: board at loc != null
 * 
 * @param board 
 * @param loc 
 * @returns Checks if the group located at loc has any liberties
 */
export function hasLiberties(board: Board, loc: Coord): boolean{
  let toVisit = [loc];
  let curr_player = board[loc.y][loc.x];
  let checkGraph = Array<Array<String>>(board.length).fill(null).map(() => { return new Array<String>(board.length).fill("N") });
  while (toVisit.length != 0) {
    let curr = toVisit.pop();
    if (checkGraph[curr.y][curr.x] == "N") {
      // Empty space => liberty
      if (board[curr.y][curr.x] == null)
        return true;
      // if the stone is the same color go to it's neightbours
      else if (board[curr.y][curr.x] == curr_player) {
        if (curr.y + 1 < board.length)
          toVisit.push(new Coord(curr.x, curr.y + 1));
        if (curr.y - 1 >= 0)
          toVisit.push(new Coord(curr.x, curr.y - 1));
        if (curr.x + 1 < board.length)
          toVisit.push(new Coord(curr.x + 1, curr.y));
        if (curr.x - 1 >= 0)
          toVisit.push(new Coord(curr.x - 1, curr.y));
      }
      checkGraph[curr.y][curr.x] = "D";
    }
  }
  return false;
}

/**
 * 
 * @param board 
 * @param curr_player 
 * @param move 
 * @returns whether the move 
 */
function commitPlaceAndKill(board: Board, curr_player: Color, move: Coord): [boolean, Board, number]{
  board[move.y][move.x] = curr_player;
  return [true, board, 0];  
}

/**
 * pre: board at loc != null
 * @param board 
 * @param loc 
 * @returns returns board after killing the group at loc, and the number of stones killed
 */
export function killGroup(board: Board, loc: Coord): [Board, number] {
  let toVisit = [loc];
  let curr_player = board[loc.y][loc.x];
  let checkGraph = Array<Array<String>>(board.length).fill(null).map(() => { return new Array<String>(board.length).fill("N") });
  let killed = 0;
  while(toVisit.length != 0){
    let curr = toVisit.pop();
    if(checkGraph[curr.y][curr.x] == "N"){
      if (board[curr.y][curr.x] == curr_player) {
        board[curr.y][curr.x] = null;
        killed += 1;
        if (curr.y + 1 < board.length)
          toVisit.push(new Coord(curr.x, curr.y + 1));
        if (curr.y - 1 >= 0)
          toVisit.push(new Coord(curr.x, curr.y - 1));
        if (curr.x + 1 < board.length)
          toVisit.push(new Coord(curr.x + 1, curr.y));
        if (curr.x - 1 >= 0)
          toVisit.push(new Coord(curr.x - 1, curr.y));
      }
      checkGraph[curr.y][curr.x] = "D";
    }
  }
  return [board, killed];
}

/**
 * Finds the board after killing the surrounding enemy groups with no liberties
 * @param board 
 * @param loc 
 * @returns new board and number of enemy stones killed
 */
function killSurroundingGroups(board: Board, loc: Coord): [Board, number]{
  let toVisit = [loc];
  let curr_player = board[loc.y][loc.x];
  let checkGraph = Array<Array<String>>(board.length).fill(null).map(() => { return new Array<String>(board.length).fill("N") });
  let killed = 0;
  while(toVisit.length != 0){
    let curr = toVisit.pop();
    if(checkGraph[curr.y][curr.x]){
      if(board[curr.y][curr.x] == null) continue;
      else if (board[curr.y][curr.x] == curr_player){
        if (curr.y + 1 < board.length)
          toVisit.push(new Coord(curr.x, curr.y + 1));
        if (curr.y - 1 >= 0)
          toVisit.push(new Coord(curr.x, curr.y - 1));
        if (curr.x + 1 < board.length)
          toVisit.push(new Coord(curr.x + 1, curr.y));
        if (curr.x - 1 >= 0)
          toVisit.push(new Coord(curr.x - 1, curr.y));
      }
      else{
        if(!hasLiberties(board, curr)){
          let [tboard, tkilled] = killGroup(board, curr);
          board = tboard;
          killed += tkilled;
        }
      }
    }
  }
  return [board, 0];
}

/**
 * @param board 
 * @param curr_player 
 * @param move 
 * @returns returns if move is valid, and if it is the resulting board, and the number of stones captured
 */
function playMove(board: Board, curr_player: Color, move: Coord): [boolean, Board, number]{
  if (board[move.y][move.x] != null) 
    return [false, board, 0];
  return commitPlaceAndKill(board, curr_player, move);
}

/**
 * pre: dead groups are removed beforehand
 * @param board 
 * @returns return territory points for [black, white]
 */
function calculateTerritory(board: Board) : [number, number] {
  return [0, 0];
}

/**
 * Class representing a game of Baduk
 * @param size 
 * @param handicap
 * @param komi
 */
export default class BadukGame {
  board: Board;
  curr_player: Color;
  prev_board: Board | null;
  black_captures: number;
  white_captures: number;
  has_passed: boolean;
  komi: number;
  constructor(size: number, handicap: Array<Coord>, komi: number) {
    let [board, curr_player] = setupBoard(size, handicap);
    this.board = board;
    this.prev_board = null;
    this.curr_player = curr_player;
    this.has_passed = false;
    this.komi = komi;
  }

  /**
   * @param move 
   * @param curr_player 
   * @returns returns whether the move was valid (boolean) or a winner (color) if the game is over
   */
  playMove(move: null | Coord, curr_player: Color): boolean | Color {
    if (curr_player != this.curr_player) return false;
    else if (move == null) {
      if (this.has_passed == true) {
        // THE GAME IS DONE
        // Calculate winner
        let [black_score, white_score] = calculateTerritory(this.board);
        black_score += this.black_captures;
        white_score += this.white_captures;
        white_score += this.komi;
        return (black_score > white_score) ? Color.BLACK : Color.WHITE;
      }
      else {
        this.has_passed = true;
      }
    }
    else {
      let [valid, nboard, captures] = playMove(this.board, this.curr_player, move);
      
      // invalid move
      if (!valid) {
        return false;
      }

      // ko not valid move
      if (isBoardEqual(this.prev_board, nboard)) {
        return false;
      }

      // update ko board
      this.prev_board = this.board;

      // update board state
      this.board = nboard;

      // update captured stones
      if (this.curr_player == Color.BLACK)
        this.black_captures += captures;
      else
        this.white_captures += captures;
    }
    // next players turn
    this.curr_player = this.curr_player == Color.BLACK ? Color.WHITE : Color.BLACK;
    return true;
  }
};
