const Board = require("./board");
const Constants = require("../../constantServer.js");

class Room {
    constructor(roomName) {
        this.roomName = roomName;
        this.sockets = [];

        this.playing = false;
        this.turn;
        this.white;

        this.board = new Board();
    }

    addSocket(socket) {
        this.sockets.push(socket);
    }

    removeSocket(socket) {
        this.sockets = this.sockets.filter(s => socket != s);
    }

    update() {
        if (!this.playing && this.sockets.length == 2) {
            this.playing = true;
            this.turn = this.sockets[0].id;
            this.white = this.sockets[0].id;
        }
    }

    makeMove(socket, moveData) {
        //return if out of bounds, not playing, choose empty piece,
        // not enough players, not player's turn
        if (moveData.endRow < 0 || moveData.endRow >= Constants.NUM_TILES_HEIGHT
            || moveData.endCol < 0 || moveData.endCol >= Constants.NUM_TILES_WIDTH
            || this.board.board[moveData.startRow][moveData.startCol] === "empty"
            || !this.playing
            || this.sockets.length < 2
            || socket.id != this.turn)
            return socket.emit("/invalidMove");

        //obtain list of all possible moves for a given piece
        console.log(this.board.board[moveData.startRow][moveData.startCol]);
        let possibleMoves = this.board.board[moveData.startRow][moveData.startCol].getMoves(this.board.board, moveData.startRow, moveData.startCol);
        console.log(possibleMoves);

        //if possibleMoves contains move moveData.endRow, moveData.endCol, move is valid
        //else not valid
        for (let i = 0; i < possibleMoves.length; i++) {
            if (possibleMoves[i].col === moveData.endCol && possibleMoves[i].row === moveData.endRow) {
                this.board.board[moveData.endRow][moveData.endCol] = this.board.board[moveData.startRow][moveData.startCol];
                this.board.board[moveData.startRow][moveData.startCol] = "empty";
                this.turn = (this.turn == this.sockets[0].id) ? this.sockets[1].id : this.sockets[0].id;
            }
        }

        socket.emit("/invalidMove");
    }

    serializeForUpdate() {
        let players = this.sockets.map(socket => { return socket.id });
        return ({
            board: this.board.serializeBoard(),
            whiteID: this.white,
        });
    }
}

module.exports = Room;