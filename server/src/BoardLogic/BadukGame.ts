import { Board, Coord, Color} from "../shared/types";
import { findBorderingColor, setVisited, cloneBoard, isBoardEqual, getNumsFromBoard} from "./helper";

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
    return [false, board, 0, "can't play ontop of a stone"];
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
export default class BadukGame {
  board: Board;
  curr_player: Color;
  prev_board: Board | null;
  black_captures: number;
  white_captures: number;
  has_passed: boolean;
  komi: number;
  is_over: boolean;
  black_territory: number;
  white_territory: number;
  ko_board: Board | null;
  
  constructor(size: number, handicap: Array<Coord>, komi: number) {
    let [board, curr_player] = setupBoard(size, handicap);
    this.board = board;
    this.prev_board = null;
    this.curr_player = curr_player;
    this.has_passed = false;
    this.komi = komi;
    this.black_captures = 0;
    this.white_captures = 0;
    this.is_over = false;
    this.ko_board = null;
  }

  /**
   * @param move 
   * @param curr_player 
   * @returns returns whether the move was valid (boolean) or a winner (color) if the game is over
   */
  playMove(move: null | Coord, curr_player: Color): [boolean | null, string] {
    if (curr_player != this.curr_player) return [false, "Illegal move, not your turn"];
    else if (move == null) {
      if (this.has_passed == true) {
        // THE GAME IS DONE
        // Calculate winner
        this.is_over = true;
        return [null, "Player has passed"];
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
        return [false, "Illegal Move, "+str];
      }

      // ko, not valid move
      if (this.ko_board !== null && isBoardEqual(this.ko_board, nboard)) {
        return [false, "Illegal Move, Ko"];
      }
      this.ko_board = this.prev_board === null ? null : cloneBoard(this.prev_board);

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

  calculateTerritory() : [number, number, string]{
    [this.black_territory, this.white_territory] = calculateTerritory(this.board);

    let black_score = this.black_captures + this.black_territory;
    let white_score = this.white_captures + this.white_territory;
    white_score += this.komi; // add Komi for white
    return [black_score, white_score, "Game over"];
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
