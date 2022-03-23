import {io} from 'http://localhost:3000/socket.io/socket.io.esm.min.js'
var socket = io('/admin');

var tabl = document.getElementById('mainTable');
var tHead = document.createElement('thead');
var tBody = document.createElement('tbody');

tabl.setAttribute('border', '1px solid');
tabl.appendChild(tHead);
tabl.appendChild(tBody);

var fieldTitles = ["Ranking", "Player", "Score", "Email"]

var tHeadRow = document.createElement('tr');
tHead.appendChild(tHeadRow);

fieldTitles.forEach(function (field) {
     var tCol = document.createElement('td');
     tCol.innerHTML = field;
     tHeadRow.appendChild(tCol);
   })

var fields = ['ranking','username', 'score'];


socket.on('ranking-data', (data) => {
  tBody.innerHTML = ""
  var rank = 1;
  data.forEach((row) =>{
    row['ranking'] = rank
    rank += 1;
    var tRow = document.createElement('tr');
    tBody.appendChild(tRow);
    
    fields.forEach(function (field) {
      var tCol = document.createElement('td');
      tCol.innerHTML = row[field];
      tRow.appendChild(tCol);
    })
  }) 
})
// for(var i = 0; i < users.length; i++) {
//   var tRow = document.createElement('tr');
//   tBody.appendChild(tRow);

//   fields.forEach(function (field) {
//     var tCol = document.createElement('td');
//     tCol.innerHTML = users[i][field];
//     tRow.appendChild(tCol);
//   })
// } 