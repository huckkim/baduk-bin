import express from "express";
import http from "http";
import { Server, Socket } from "socket.io"

const app = express();
const server = new http.Server(app);
const io = new Server(server);
const port = process.env.PORT || 2567;

server.listen(port, () => {
  console.log("server listening on port", port);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user has connected');
  socket.on('disconnect', () => {
    console.log('a user has disconnected');
  });
});

io.on('startGame', () => {
  console.log("Game has begun");
  io.emit('startGame');
});
