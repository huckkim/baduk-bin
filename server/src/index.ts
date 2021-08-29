let size: number = 9;

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

// setup Board with proper handicap
export function setupBoard(size: number, handicap: Array<Coord>): [Board, Color] {
  let board = new Array<Array<null | Color>>(size).fill(null).map(() => { return new Array<null | Color>(size).fill(null) });
  if (handicap.length == 0) {
    return [board, Color.BLACK];
  }
  handicap.forEach((coord: Coord) => { board[coord.y][coord.x] = Color.BLACK });
  return [board, Color.WHITE];
}

// returns if move is valid, and if it is the resulting board, and the number of stones captured
function playMove(board: Board, curr_player: Color, move: Coord): [boolean, Board, number]{
  if (board[move.y][move.x] != null) 
    return [false, board, 0];
  return commitPlaceAndKill(board, curr_player, move);
}

// Checks if the group located at loc has any liberties
// pre: board at loc != null
export function hasLiberties(board: Board, loc: Coord): boolean{
  let toVisit: Array<Coord> = [loc];
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

function commitPlaceAndKill(board: Board, curr_player: Color, move: Coord): [boolean, Board, number]{
  board[move.y][move.x] = curr_player;

  return [true, board, 0];  
}

// 
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

export function killGroup(board: Board, loc: Coord): [Board, number] {
  let toVisit = [loc];
  let curr_player = board[loc.y][loc.x];
  let checkGraph = Array<Array<String>>(board.length).fill(null).map(() => { return new Array<String>(board.length).fill("N") });
  let killed: number = 0;
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
