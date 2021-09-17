import { Socket, Server } from 'socket.io'
import { getNumsFromBoard } from '../BoardLogic/helper';
import { Coord, Color } from '../shared/types';
import BadukGame from '../BoardLogic/BadukGame'

// Single Game state manager
export class BadukGameRoom{
  spectators: Array<Socket>;
  black_client: Socket;
  white_client: Socket;
  game: BadukGame;
  server: Server;
  has_started: boolean;
  roomID: string;
  constructor(server: Server, roomID: string){
    this.server = server;
    this.has_started = false;
    this.roomID = roomID;
  }

  startGame() {
    this.server.to(this.roomID).emit("START_GAME")

    this.black_client.on("PLAY_MOVE", () => {
      console.log("PAIN");
    })

    this.white_client.on("PLAY_MOVE", () => {
      console.log("PAIN");
    })
  }

  /*
  addBlack(socket: Socket) {
    this.black_client = socket;
    socket.emit("PLAYING_BLACK")
  }

  addWhite(socket: Socket) {
    this.white_client = socket;
    socket.emit("PLAYING_WHITE")
  }

  playMove(socket: Socket, x: number, y: number) {
    if(this.game.prev_board != null)
      console.log(getNumsFromBoard(this.game.prev_board));
    var [res, msg] = this.game.playMove(new Coord(x, y), (socket.id === this.black_client.id) ? Color.BLACK : Color.WHITE);
    if (typeof res !== "boolean") {
      this.server.emit("GAME_END", (res[0] === Color.BLACK) ? this.black_client : this.white_client, res[1], res[2], msg);
    }
    else {
      // Valid move
      if (res) {
        this.server.emit("UPDATE_BOARD", getNumsFromBoard(this.game.board), this.game.black_captures, this.game.white_captures, msg);
      }
      else {
        socket.emit("ERROR", msg);
      }
    }
  }

  pass(socket) {
    var [res, msg] = this.game.playMove(null, (socket.id === this.black_client.id) ? Color.BLACK : Color.WHITE);
    if (typeof res !== "boolean") {
      console.log("Game ended");
      console.log(res, msg)
      let [winner, black_score, white_score] = res;
      this.server.emit("GAME_END", winner === Color.BLACK ? 1 : -1, black_score, white_score, msg);
    }
    else {
      // Valid move
      if (res) {
        this.server.emit("UPDATE_BOARD", getNumsFromBoard(this.game.board), this.game.black_captures, this.game.white_captures, msg);
      }
      else {
        socket.emit("ERROR", msg);
      }
    }
  }

  startGame() {
    this.has_started = true;
    this.game = new BadukGame(19, [], 6.5);
    this.server.emit("GAME_STARTED", getNumsFromBoard(this.game.board));
    this.black_client.emit("BLACK_PLAYER");
    this.white_client.emit("WHITE_PLAYER");
  }
  */
}

export default BadukGameRoom;
