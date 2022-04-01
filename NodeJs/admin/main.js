import { io } from 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.esm.min.js'
const socket = io('/admin');

const tabl = document.getElementById('mainTable');
const tHead = document.createElement('thead');
const tBody = document.createElement('tbody');
const fieldTitles = ["Ranking", "Jogador", "Score"]
const dataFields = ['ranking', 'username', 'score'];

const button = document.getElementById("start-btn");
button.addEventListener('click', function (e) {
  const startCode = prompt("Insert the code");
  socket.emit('start-game', startCode);
}, false)

initTable();

socket.on('ranking-data', (data) => {
  updateTable(data)
})


function initTable() {
  tabl.setAttribute('border', '1px solid');
  tabl.appendChild(tHead);
  tabl.appendChild(tBody);

  var tHeadRow = document.createElement('tr');
  tHead.appendChild(tHeadRow);

  fieldTitles.forEach(function (field) {
    var tCol = document.createElement('th');
    tCol.innerHTML = field;
    tHeadRow.appendChild(tCol);
  })
}

function updateTable(data) {
  tBody.innerHTML = ""
  data.forEach((row) => {
    var tRow = document.createElement('tr');
    tBody.appendChild(tRow);

    dataFields.forEach(function (field) {
      var tCol = document.createElement('td');
      tCol.innerHTML = row[field];
      tRow.appendChild(tCol);
    })
  })
}