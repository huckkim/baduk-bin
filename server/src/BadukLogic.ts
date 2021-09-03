import { kill } from "process";
import { cursorTo } from "readline";

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
      if (board1[i][j] !== board2[i][j]) return false;
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
export function selectGroup(board: Board, loc: Coord): Board{
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

/**
 * @param board
 * @return given a board, return an array of coords for location of black and white stones
 */
export function getCoordFromBoard(board: Board) : [Array<Coord>, Array<Coord>] {
  let black_coords = [];
  let white_coords = [];
  for (let i = 0; i < board.length; ++i){
    for (let j = 0; j < board.length; ++j){
      if (board[i][j] == Color.BLACK) {
        black_coords.push(new Coord(j, i));
      }
      else if (board[i][j] == Color.WHITE) {
        white_coords.push(new Coord(j, i));
      }
    }
  }
  return [black_coords, white_coords];
}

export function getStringsFromBoard(board: Board): Array<Array<string>> {
  let nboard = [];
  for (let i = board.length - 1; i >= 0; --i){
    let row = board[i].map((val) => (val === null) ? '-' : ((val === Color.BLACK) ? 'X' : 'O'));
    nboard.push(row);
  }
  return nboard;
}

export function getBoardFromStrings(board: Array<Array<string>>): Board{
  let [nboard,] = setupBoard(board.length, []);
  for (let i = 0; i < board.length; ++i){
    for (let j = 0; j < board.length; ++j){
      if (board[i][j] == 'X') nboard[i][j] = Color.BLACK;
      else if (board[i][j] == 'O') nboard[i][j] = Color.WHITE;
    }
  }
  return nboard;
}

/**
 * find the bordering color empty space at loc
 * pre: board at loc == null, if both colors or none are present return null
 * @param board 
 * @param loc 
 * @returns 
 */
export function findBorderingColor(board: Board, loc: Coord): Color | null{
  let toVisit = [loc];
  let visited = Array<Array<boolean>>(board.length).fill(null).map(() => { return new Array<boolean>(board.length).fill(false) });
  let curr_color = null;
  while (toVisit.length != 0) {
    let curr = toVisit.pop();
    if (!visited[curr.y][curr.x]) {
      if (board[curr.y][curr.x] !== null) {
        if (curr_color === null) curr_color = board[curr.y][curr.x];
        else if (curr_color != board[curr.y][curr.x]) return null;
      }
      else {
        if (curr.y + 1 < board.length)
          toVisit.push(new Coord(curr.x, curr.y + 1));
        if (curr.y - 1 >= 0)
          toVisit.push(new Coord(curr.x, curr.y - 1));
        if (curr.x + 1 < board.length)
          toVisit.push(new Coord(curr.x + 1, curr.y));
        if (curr.x - 1 >= 0)
          toVisit.push(new Coord(curr.x - 1, curr.y));
      }

      visited[curr.y][curr.x] = true;
    }
  }
  return curr_color;
}

export function setVisited(board: Board, visited: Array<Array<boolean>>, loc: Coord): Array<Array<boolean>>{
  let toVisit = [loc];
  let tvisited = Array<Array<boolean>>(board.length).fill(null).map(() => { return new Array<boolean>(board.length).fill(false) });
  let sz = 0;
  while (toVisit.length != 0) {
    let curr = toVisit.pop();
    if (!tvisited[curr.y][curr.x]) {
      if (board[curr.y][curr.x] == null) {
        visited[curr.y][curr.x] = true;
        if (curr.y + 1 < board.length)
          toVisit.push(new Coord(curr.x, curr.y + 1));
        if (curr.y - 1 >= 0)
          toVisit.push(new Coord(curr.x, curr.y - 1));
        if (curr.x + 1 < board.length)
          toVisit.push(new Coord(curr.x + 1, curr.y));
        if (curr.x - 1 >= 0)
          toVisit.push(new Coord(curr.x - 1, curr.y));
      }
      tvisited[curr.y][curr.x] = true;
    }
  }
  return visited;
}

export function alphaToCoord(str: String): Coord {
  let x = str.charCodeAt(0) - 65;
  if (x >= 9) --x;
  let y = str.charCodeAt(1) - 49;
  return new Coord(x, y);
}

export function cloneBoard(board: Board): Board{
  let nboard = []
  board.forEach((row) => {
    let nrow = row.map((e) => e);
    nboard.push(nrow);
  })
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
  let visisted = Array<Array<boolean>>(board.length).fill(null).map(() => { return new Array<boolean>(board.length).fill(false) });
  while (toVisit.length != 0) {
    let curr = toVisit.pop();
    if (!visisted[curr.y][curr.x]) {
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
      visisted[curr.y][curr.x] = true;
    }
  }
  return false;
}

/**
 * @param board 
 * @param curr_player 
 * @param move 
 * @returns returns if a move is valid and if it is, the resulting board and the number of stones captured
 */
function playBoardMove(board: Board, curr_player: Color, move: Coord): [boolean, Board, number, string]{
  if (board[move.y][move.x] != null) 
    return [false, board, 0, "Can't play ontop of a stone"];
  return commitPlaceAndKill(board, curr_player, move);
}

/**
 * 
 * @param board 
 * @param curr_player 
 * @param loc 
 * @returns whether the move of placing a stone of curr_player at loc is valid, and if so
 *          the new board and the number of stones killed
 */ 
function commitPlaceAndKill(board: Board, curr_player: Color, loc: Coord): [boolean, Board, number, string]{
  board[loc.y][loc.x] = curr_player;
  if (hasLiberties(board, loc)) {
    let [nboard, killed] = killSurroundingGroups(board, loc);
    return [true, nboard, killed, "Ok"];
  }
  else {
    let [nboard, killed] = killSurroundingGroups(board, loc);
    if (killed == 0) {
      board[loc.y][loc.x] = null; // reset player
      return [false, board, 0, "Suicide is illegal"];
    }
    return [true, nboard, killed, "Ok"];
  }
}

/**
 * Finds the board after killing the surrounding enemy groups with no liberties
 * @param board 
 * @param loc 
 * @returns new board and number of enemy stones killed
 */
export function killSurroundingGroups(board: Board, loc: Coord): [Board, number]{
  let toVisit = [loc];
  let curr_player = board[loc.y][loc.x];
  let visisted = Array<Array<boolean>>(board.length).fill(null).map(() => { return new Array<boolean>(board.length).fill(false) });
  let killed = 0;
  while(toVisit.length != 0){
    let curr = toVisit.pop();
    if(!visisted[curr.y][curr.x]){
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
      visisted[curr.y][curr.x] = true;
    }
  }
  return [board, killed];
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
  let visited = Array<Array<boolean>>(board.length).fill(null).map(() => { return new Array<boolean>(board.length).fill(false) });
  let killed = 0;
  while(toVisit.length != 0){
    let curr = toVisit.pop();
    if(!visited[curr.y][curr.x]){
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
      visited[curr.y][curr.x] = true;
    }
  }
  return [board, killed];
}

// pre: board at loc is empty
export function findSpaceSize(board: Board, loc: Coord): number{
  let toVisit = [loc];
  let visited = Array<Array<boolean>>(board.length).fill(null).map(() => { return new Array<boolean>(board.length).fill(false) });
  let sz = 0;
  while (toVisit.length != 0) {
    let curr = toVisit.pop();
    if (!visited[curr.y][curr.x]) {
      if (board[curr.y][curr.x] == null) {
        sz += 1;
        if (curr.y + 1 < board.length)
          toVisit.push(new Coord(curr.x, curr.y + 1));
        if (curr.y - 1 >= 0)
          toVisit.push(new Coord(curr.x, curr.y - 1));
        if (curr.x + 1 < board.length)
          toVisit.push(new Coord(curr.x + 1, curr.y));
        if (curr.x - 1 >= 0)
          toVisit.push(new Coord(curr.x - 1, curr.y));
      }
      visited[curr.y][curr.x] = true;
    }
  }
  return sz;
}

/**
 * pre: dead groups are removed beforehand
 * @param board 
 * @returns return territory points for [black, white]
 */
export function calculateTerritory(board: Board) : [number, number] {
  let visited = Array<Array<boolean>>(board.length).fill(null).map(() => { return new Array<boolean>(board.length).fill(false) });
  let black_territory = 0;
  let white_territory = 0;
  for (let i = 0; i < board.length; ++i){
    for (let j = 0; j < board.length; ++j){
      if (!visited[i][j] && board[i][j] === null) {
        let loc = new Coord(j, i);
        let color = findBorderingColor(board, loc);
        let sz = findSpaceSize(board, loc);
        if (color === Color.BLACK) {
          black_territory += sz;
        }
        else if (color === Color.WHITE) {
          white_territory += sz;
        }
        // else color === null => empty board / disputed areas no points
        
        // mark as viewed
        setVisited(board, visited, loc);
      }
    }
  }
  return [black_territory, white_territory];
}

/**
 * Class representing a game of Baduk
 * @param size 
 * @param handicap
 * @param komi
 */
export class BadukGame {
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
    this.black_captures = 0;
    this.white_captures = 0;
  }

  /**
   * @param move 
   * @param curr_player 
   * @returns returns whether the move was valid (boolean) or a winner (color) if the game is over
   */
  playMove(move: null | Coord, curr_player: Color): [boolean | [Color, number, number], string] {
    if (curr_player != this.curr_player) return [false, "Illegal move, not players turn"];
    else if (move == null) {
      if (this.has_passed == true) {
        // THE GAME IS DONE
        // Calculate winner
        let [black_score, white_score] = calculateTerritory(this.board);
        black_score += this.black_captures;
        white_score += this.white_captures;
        white_score += this.komi;
        return [[(black_score > white_score) ? Color.BLACK : Color.WHITE, black_score, white_score], "Game over"];
      }
      else {
        this.has_passed = true;
      }
    }
    else {
      this.has_passed = false;
      let [valid, nboard, captures, str] = playBoardMove(this.board, this.curr_player, move);
      // invalid move
      if (!valid) {
        return [false, "Illegal Move,"+str];
      }

      // ko, not valid move
      if (this.prev_board !== null && isBoardEqual(this.prev_board, nboard)) {
        return [false, "Illegal Move, Ko"];
      }

      // update ko board
      this.prev_board = cloneBoard(this.board);

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
    return [true, "Valid Move"];
  }
  removeGroup(loc: Coord): void{
    if (this.board[loc.y][loc.x] === Color.BLACK) {
      let [nboard, killed] = killGroup(this.board, loc);
      this.white_captures += killed;
      this.board = nboard;
    }
    else if (this.board[loc.y][loc.x] === Color.WHITE) {
      let [nboard, killed] = killGroup(this.board, loc);
      this.black_captures += killed;
      this.board = nboard;
    }
  }
};
