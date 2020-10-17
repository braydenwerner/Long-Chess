const Board = require("./board");

class Room {
    constructor(roomName) {
        this.roomName = roomName;
        this.sockets = [];
        this.playing = false;

        //sockets[0] is white, sockets[1] is black

        this.board = new Board();
    }

    addSocket(socket) {
        this.sockets.push(socket);
    }

    removeSocket(socket) {
        this.sockets = this.sockets.filter(s => socket != s);
    }

    serializeForUpdate() {
        let players = this.sockets.map(socket => { return socket.id });
        return ({
            board: this.board.serializeBoard(),
            whiteID: this.sockets[0].id,
        });
    }
}

module.exports = Room;