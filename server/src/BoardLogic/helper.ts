import { Board, Coord, Color} from "../shared/types";
import { setupBoard } from "./BadukGame";

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

export function getNumsFromBoard(board: Board): Array<Array<number>> {
  let nboard = [];
  board.forEach((row) => {
    let nrow = row.map((val) => (val === null) ? 0 : ((val === Color.BLACK) ? 1 : -1));
    nboard.push(nrow);
  })
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

