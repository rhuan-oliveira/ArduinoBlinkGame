import {io} from 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.esm.min.js';

var socket = io();
const player = {
  username: '',
  playerToken: '',
  score: 0
};

var gameStatus = 'waiting';

const button = document.getElementById("blink-btn");
button.addEventListener('click', function (e) {
  if (gameStatus !== 'ready') {
    return;
  }
  socket.emit('player-click', player);
}, false);

socket.emit('join-game', player);

socket.on('joined-game', (data)=>{
  player.playerToken = data.playerToken;
  player.username = data.username;
  player.score = data.score;
  gameStatus = data.gameStatus;
  document.getElementById("username").innerHTML = data.username;
  document.getElementById("playerToken").innerHTML = data.playerToken;
});

socket.on('game-status', (data) => {
  gameStatus = data;
});


socket.on('valid-click', (data) => {
  const light = document.getElementById('light-fill');
  if (light.style.fill === 'none') {
    light.style.fill='#6c63ff';
  }else{
    light.style.fill = 'none';
  }
  player.score = data;
  document.getElementById("blinksCount").innerHTML = data;
});

socket.on('invalid-player', ()=>{
  document.location.reload();
});

socket.on('winner-found', (data)=>{
  button.disabled = true;
  button.removeEventListener('click', ()=>{});
});

socket.on('you-win', ()=>{
  alert('VOCÊ GANHOU');
});