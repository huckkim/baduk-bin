import express from "express";
import http from "http";
import { Server, Socket } from "socket.io"
import { ApolloServer } from "apollo-server"

import resolvers from './resolvers';
import entities from './type-defs';

const server = new ApolloServer({ resolvers, entities});

const app = express();
const port = process.env.PORT || 2567;

server.listen().then(({url}) => console.log(`Server started at ${url}`))

if(module.hot){
  module.hot.accept();
  module.hot.dispose( () => console.log('Module disposed. '));
}
