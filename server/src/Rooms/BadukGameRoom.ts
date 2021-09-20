import { Socket, Server } from 'socket.io'
import { getNumsFromBoard } from '../BoardLogic/helper';
import { Coord, Color } from '../shared/types';
import BadukGame from '../BoardLogic/BadukGame'
import { emit } from 'process';

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
    this.spectators = [];
    this.black_client = null;
    this.white_client = null;
    this.game = null;
    this.server = server;
    this.has_started = false;
    this.roomID = roomID;
  }

  addBlack(socket: Socket) {
    this.black_client = socket;
  }

  addWhite(socket: Socket) {
    this.white_client = socket;
  }

  addRandom(socket: Socket) {
    if (Math.random()) {
      this.addBlack(socket);
    }
    else {
      this.addWhite(socket);
    }
  }

  addOther(socket: Socket) {
    if (this.black_client === null) {
      this.black_client = socket;
    }
    else if(this.white_client === null) {
      this.white_client = socket;
    }
    else {
      this.spectators.push(socket);
    }
  }

  startGame() {
    this.black_client.emit("PLAYING_BLACK");
    this.white_client.emit("PLAYING_WHITE");
    this.server.to(this.roomID).emit("START_GAME", getNumsFromBoard(this.game.board));
  }

  playMove(socket: Socket, x: number, y: number) {
    const color = (socket.id == this.black_client.id) ? Color.BLACK : (socket.id === this.white_client.id) ? Color.WHITE : null;
    if (color === null) {
      socket.emit('ERROR', 'You are not a player');
    }
    let [res, msg] = this.game.playMove(new Coord(x, y), color);
    if (res){
      this.server.to(this.roomID).emit("UPDATE_BOARD", getNumsFromBoard(this.game.board), this.game.black_captures, this.game.white_captures, msg)
    }
    else {
      socket.emit('ERROR', msg);
    }
  }

  playPass(socket: Socket) {
    const color = (socket.id == this.black_client.id) ? Color.BLACK : (socket.id === this.white_client.id) ? Color.WHITE : null;
    if (color === null) {
      socket.emit('ERROR', 'You are not a player');
    }

    // Handle removing groups

    if (this.game.is_over) {
      let [black_score, white_score, msg] = this.game.calculateTerritory();
      console.log("Game ended: ", msg);
      let winner = (black_score > white_score) ? 1 : -1;
      this.server.emit("GAME_END", winner, black_score, white_score, msg);
    }
  }
}

export default BadukGameRoom;
