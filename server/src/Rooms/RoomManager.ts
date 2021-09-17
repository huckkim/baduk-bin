import { Server } from "socket.io";
import { BadukGameManager } from './../BoardLogic/BadukGame'
import { Coord } from './../shared/types'

class RoomManager {
  server: Server;
  rooms: Record<string, BadukGameManager>
  constructor(server: Server){
  }

  createNewGame(size: number, handicap: Array<Coord>){
  }
};

export default RoomManager;
