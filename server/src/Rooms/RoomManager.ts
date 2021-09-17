import { Server, Socket } from "socket.io";
import BadukGameRoom from './BadukGameRoom'
import {v4 as uuidv4 } from 'uuid'

const RoomManager = (io: Server) => {
  const rooms: Map<string, BadukGameRoom> = new Map();

  io.on('connection', (socket: Socket) => {
    console.log("Connection established with:", socket.id)
    // Create a new game
    // - size of board
    // - handicap for black
    // - game creator color: black, white, random
    socket.on('CREATE_GAME', (size: string, handicap: Array<Array<string>>, color: string) => {
      const roomID = uuidv4();
      const game_state = new BadukGameRoom(io, roomID);
      socket.join(roomID);
      if (color == 'black') {
        game_state.addBlack(socket);
      } else if (color == 'white') {
        game_state.addWhite(socket);
      }
      else {
        game_state.addRandom(socket);
      }
      rooms.set(roomID, game_state);
      socket.emit('ROOM_ID', roomID);
    });

    socket.on('JOIN_GAME', (roomID: string) => {
      const game_state = rooms.get(roomID);
      socket.join(roomID);
      game_state.addOther(socket);
    })

    socket.on('PLAY_MOVE', (x: string, y: string, pass: boolean, roomID: string) => {
      const game_state = rooms.get(roomID);
      if (pass) {
        game_state.playPass(socket);
      }
      else {
        game_state.playMove(socket, parseInt(x), parseInt(y));
      }
    });
  });
};

export default RoomManager;

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
