import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import { Coord } from './../shared/types'
import {v4 as uuidv4 } from 'uuid'
import BadukGameRoom from './BadukGameRoom'

class RoomManager {
  server: Server;
  rooms: Map<string, BadukGameRoom>
  constructor(server: Server){
    this.server = server;
    this.rooms = new Map();
  }

  createNewGame(socket: Socket, size: number, handicap: Array<Coord>){
    // create a new room and emit id to socket
    const roomID = uuidv4();
    this.rooms.set(roomID, new BadukGameRoom(this.server, roomID));
    socket.join(roomID);
  }

  joinGame(socket: Socket, roomID: string) {
    this.rooms[roomID];
  }
};

/*
  socket.on("PLAY_MOVE", (x: string, y: string, pass: boolean) => {
    if (!game.has_started) {
      console.log("Game not started");
      socket.emit("ERROR", "Game not started");
    }
    else {
      console.log("Move", x, y, "entered");
      if (pass) 
        game.pass(socket);
      else {
        game.playMove(socket, parseInt(x), parseInt(y));
      }
    }
  });

  socket.on("START_GAME", () => {
    if (clients.length < 2) {
      console.log("Not enough players");
      socket.emit("ERROR", "Not enough players");
    }
    else {
      console.log("Staring game");
      game.addBlack(clients[0]);
      game.addWhite(clients[1]);
      game.startGame();
    }
  })

  socket.on("disconnect", () => {
    console.log("Connection lost with:", socket.id);
    let i = clients.indexOf(socket);
    if (i > -1) {
      clients.splice(i, 1);
    }
    console.log(clients.length)
  })
  */
export default RoomManager;
