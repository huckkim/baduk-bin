import express from "express";
import http from "http";
import { Server } from "socket.io"
import cors from 'cors'

import RoomManager from "./Rooms/RoomManager";

// Configure Database

// Configure API

//  - GET newGame 
//    in: size, handicap, color, 
//   out: socket game room id
// internally a new room will be created that has as game manager
// the room will keep track of the state of the game and when it is done
// save the game to the database

//  - GET game
//    in: url / id
//   out: redirct to socket room?

const app = express();
const router = express.Router();
const server = new http.Server(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods:['GET', 'POST']
  }
});
const port = process.env.PORT || 2567;

app.use(cors());

server.listen(port, () => {
  console.log("server listening on port", port);
});


/**
 *  Socket.IO Room + Game Management 
 *    - RoomManager stores instances of GameRoom
 *    - GameRoom takes in players and manages game states
 */
// SOcket IO Room Manager
RoomManager(io);

if(module.hot){
  module.hot.accept();
  module.hot.dispose( () => console.log('Module disposed. '));
}
