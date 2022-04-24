// Johhny-five led toggle with socket.io
import express from "express";
import http from 'http';
import { Board, Led } from "johnny-five";
import { Server } from "socket.io";

// NodeJs Server
const app = express();
const PORT = 3000;
const server = http.createServer(app);
app.use("/",express.static('public'));
const io = new Server(server);
server.listen(PORT, ()=> {
  console.log('listening on *:3000');
})

// Johhny-Five JS
const board = new Board({repl: false});
board.on("ready", () => {
  const led = new Led(13);
  io.on('connection', (socket) => {
    console.log('connected')
    socket.on('player-click', () => {
      console.log('click')
      led.toggle()
    });
  })
})
