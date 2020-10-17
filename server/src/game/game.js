const Room = require("./room.js");

class Game {
  constructor() {
    this.rooms = {};
    this.shouldSendUpdate = false
    this.lastUpdateTime = Date.now();

    setInterval(this.update.bind(this), 1000 / 60);
  }

  addSocket(socket, roomName) {
    if (this.rooms[roomName]) this.rooms[roomName].addSocket(socket)
    else {
      this.rooms[roomName] = new Room(roomName);
      this.rooms[roomName].addSocket(socket);
    }
  }

  removeSocket(socket) {
    Object.keys(this.rooms).forEach(roomID => {
      const room = this.rooms[roomID];

      room.sockets.map(s => {
        if (socket == s) room.removeSocket(socket);
      });
    });
  }

  input(socket, inputData) {
    this.players[socket.id].input(inputData);
  }

  update() {
    //check if a room is empty, if so remove it
    Object.keys(this.rooms).forEach(roomID => {
      const room = this.rooms[roomID];

      if (room.sockets.length == 0) delete this.rooms[room.roomName];
    });

    if (this.shouldSendUpdate) {
      Object.keys(this.rooms).forEach(roomID => {
        const room = this.rooms[roomID];

        room.sockets.map(socket => {
          socket.emit("/gameUpdate", this.sendUpdate(room));
        });
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  sendUpdate(room) {
    return ({
      t: Date.now(),
      room: room.serializeForUpdate(),
    });
  }
}

module.exports = Game;
