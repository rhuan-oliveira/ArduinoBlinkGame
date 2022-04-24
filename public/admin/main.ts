import { io } from "socket.io-client";
import './style.css';

const socket = io("/admin");

const tabl = document.getElementById("mainTable")!;
const tHead = document.createElement("thead");
const tBody = document.createElement("tbody");
const fieldTitles = ["Ranking", "Jogador", "Score"];
const dataFields = ["ranking", "username", "score"];

const button = document.getElementById("start-btn")! as HTMLButtonElement;
button.addEventListener(
  "click",
  function () {
    const startCode = prompt("Insert the code");
    socket.emit("start-game", startCode);
  },
  false
);

initTable();

socket.on("ranking-data", (data) => {
  updateTable(data);
});

function initTable() {
  tabl.setAttribute("border", "1px solid");
  tabl.appendChild(tHead);
  tabl.appendChild(tBody);

  var tHeadRow = document.createElement("tr");
  tHead.appendChild(tHeadRow);

  fieldTitles.forEach(function (field) {
    var tCol = document.createElement("th");
    tCol.innerHTML = field;
    tHeadRow.appendChild(tCol);
  });
}

type ranking = [{ [key: string]: string }]

function updateTable(data: ranking) {
  tBody.innerHTML = "";
  data.forEach((row) => {
    var tRow = document.createElement("tr");
    tBody.appendChild(tRow);

    dataFields.forEach(function (field: string) {
      var tCol = document.createElement("td");
      tCol.innerHTML = row[field];
      tRow.appendChild(tCol);
    });
  });
}
