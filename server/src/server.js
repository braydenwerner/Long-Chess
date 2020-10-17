const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");

const router = require("./router.js");

const Game = require("./game/game.js");

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  socket.on("/createRoom", roomName => {
    if (game.rooms[roomName]) socket.emit("/alreadyExists");
    else {
      game.addSocket(socket, roomName);
    }
  });

  socket.on("/joinRoom", roomName => {
    if (game.rooms[roomName] && game.rooms[roomName].sockets.length >= 2) socket.emit("/roomFull");
    else {
      game.addSocket(socket, roomName);
    }
  })

  socket.on("/input", inputData => {
    game.input(socket, inputData);
  });

  socket.on("disconnect", () => {
    game.removeSocket(socket);
  });
});

const game = new Game();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
