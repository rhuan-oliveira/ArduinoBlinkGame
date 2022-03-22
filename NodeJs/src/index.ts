import express from "express";
import http from 'http';
import { Server } from "socket.io";

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('click', (msg)=>{
    console.log('user click:', msg);
  })
});


server.listen(PORT, ()=> {
  console.log('listening on *:3000');
})
