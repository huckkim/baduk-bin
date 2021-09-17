import express from "express";
import http from "http";
import { Server } from "socket.io"
import { BadukGameManager } from "./BoardLogic/BadukGame"
import cors from 'cors'
import { ApolloServer } from "apollo-server"

import resolvers from './resolvers';
import entities from './type-defs';

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

router.get('/basicTest', async (req, res) =>{
  res.send('/basicTest')
});

var game = new BadukGameManager(io);
var clients = [];

// Starting point for users
io.on('connection', (socket) => {
  console.log("Connection established with:", socket.id)
  // Add Socket to list of clients
  clients.push(socket);

  socket.on("JOIN_GAME", () => {

  });

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
});

if(module.hot){
  module.hot.accept();
  module.hot.dispose( () => console.log('Module disposed. '));
}
