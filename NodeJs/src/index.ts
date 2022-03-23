import express from "express";
import http from 'http';
import gameLogic from "./gameLogic";

const app = express();
const PORT = 3000;
const server = http.createServer(app);

app.use("/",express.static('public'));
app.use("/admin",express.static('admin'));

server.listen(PORT, ()=> {
  console.log('listening on *:3000');
})

gameLogic(server);