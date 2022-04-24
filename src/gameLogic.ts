import { Server } from "socket.io";
import { Server as HttpServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

interface game {
  players: {
    [tokenId: string]: {
      ranking: number,
      username: string,
      score: number,
      socketId: string
    }
  };
  status: 'ready' | 'done' | 'waiting';
}

export default async (server: HttpServer) => {
  const game = <game>{ players: {}, status: 'waiting' };
  const io = new Server(server);
  const adminPass = process.env.ADMIN_KEY;
  const maximumScore = Number(process.env.MAXIMUM_SCORE) || 250;
  const initialScore = Number(process.env.INITIAL_SCORE) || 0;
  const scoreIncrease = Number(process.env.SCORE_INCREASE_BY || 1);

  io.of('/arduino').on('connection', () => {
    console.log('Arduino connected');
  })

  io.of('/admin').on('connection', (socket) => {
    console.log('Admin connected');
    socket.on('start-game', (data) => {
      if (data !== adminPass) {
        return;
      }
      game.status = 'ready';
      io.emit('game-status', game.status);
    })
  })

  io.on('connection', (socket) => {
    socket.on('join-game', (data) => {
      const username = randomUsername();
      const playerToken = uuidv4();
      game.players[playerToken] = { ranking: 0, username, score: initialScore, socketId: socket.id };
      socket.emit('joined-game', { playerToken, username, gameStatus: game.status });
      updateRanking();
    })

    socket.on('player-click', (data) => {
      const player = game.players[data.playerToken]
      if (game.status !== 'ready') {
        return;
      }
      if (!player) {
        socket.emit('invalid-player');
        return;
      }
      player.score += scoreIncrease;
      socket.emit('valid-click', player.score);
      winnerEmit();
      updateRanking();
    })
  });

  async function winnerEmit() {
    var players = Object.keys(game.players);
    var player = players.find(key => game.players[key].score >= maximumScore);
    if (player) {
      io.emit('winner-found', 'O jogo acabou');
      console.log(player);
      io.to(game.players[player].socketId).emit('you-win');
      game.status = 'done';
    }
  }

  function randomUsername(): string {
    const a = ["UNO", "MEGA", "NANO", "MICRO", "MINI", "YUN", "TIAN", "101", "ZERO", "DUEMILANOVE", "DIECIMILA", "EXTREMEV2", "EXTREME", "NG240", "LEONARDO"];
    const b = ["VERMELHO", "LARANJA", "AMARELO", "VERDE", "AZUL", "INDIGO", "VIOLETA", "ROXO", "ROSA", "DOURADO", "CINZA", "CASTANHO", "BRONZE", "PRATA", "OURO"];
    const c = ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10"];
    const rA = Math.floor(Math.random() * a.length);
    const rB = Math.floor(Math.random() * b.length);
    const rC = Math.floor(Math.random() * c.length);
    const username = "ARDUINO_" + a[rA] + '_' + b[rB] + c[rC];
    return username;
  }

  async function updateRanking() {
    const players = Object.values(game.players);
    players.sort((a, b) => (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0));
    const ranking = players.map((obj, i) => ({ ...obj, ranking: i + 1 }));
    io.of('/admin').emit('ranking-data', ranking);
    io.of('/arduino').emit('update-score', ranking[0].score);
  }
}
