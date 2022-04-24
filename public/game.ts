import {io} from 'socket.io-client';
import './style.css';

var socket = io();
const player = {
  username: '',
  playerToken: '',
  score: 0
};

var gameStatus = 'waiting';

const button = document.getElementById("blink-btn")! as HTMLButtonElement;
button.addEventListener('click', function (eventSource) {
  eventSource.preventDefault; // reset animation
  const eventTarget = eventSource.target as Element;
  eventTarget.classList.remove('animate');
  eventTarget.classList.add('animate');
  setTimeout(function () {
    eventTarget.classList.remove('animate');
  }, 200);
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
  document.getElementById("username")!.innerHTML = data.username;
  document.getElementById("playerToken")!.innerHTML = data.playerToken;
});

socket.on('game-status', (data) => {
  gameStatus = data;
});


socket.on('valid-click', (data) => {
  const light = document.getElementById('light-fill')!;
  if (light.style.fill === 'none') {
    light.style.fill='#6c63ff';
  }else{
    light.style.fill = 'none';
  }
  player.score = data;
  document.getElementById("blinksCount")!.innerHTML = data;
});

socket.on('invalid-player', ()=>{
  document.location.reload();
});

socket.on('winner-found', ()=>{
  button.disabled = true;
  button.removeEventListener('click', ()=>{});
});

socket.on('you-win', ()=>{
  alert('VOCÊ GANHOU');
});