import { io }  from 'socket.io-client';
import { Board, Led } from "johnny-five";

const board = new Board({repl: false});
const socket = io('http://localhost:3000/arduino');
board.on("ready", () => {
  const led = new Led(13);

  // Change led state
  socket.on('led:toggle', () => {
    led.toggle()
  });
})
