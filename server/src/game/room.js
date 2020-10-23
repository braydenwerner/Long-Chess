const Board = require("./board");
const Constants = require("../../constantServer.js");
const King = require("./pieces/king");

class Room {
    constructor(roomName) {
        this.roomName = roomName;
        this.sockets = [];

        this.selectedPieceWhite = -1;
        this.selectedPieceBlack = -1;

        this.playing = false;
        this.turn;
        this.white;

        this.board = new Board();
    }

    addSocket(socket) {
        this.sockets.push(socket);
        if (this.sockets.length === 1) this.white = this.sockets[0].id;
    }

    removeSocket(socket) {
        this.sockets = this.sockets.filter(s => socket != s);
    }

    update() {
        if (!this.playing && this.sockets.length == 2) {
            this.playing = true;
            this.turn = this.sockets[0].id;
        }
    }

    selectPiece(socket, piece) {
        if (this.playing && socket.id === this.sockets[0].id) this.selectedPieceWhite = piece;
        else if (this.playing && socket.id === this.sockets[1].id) this.selectedPieceBlack = piece;
    }

    makeMove(socket, moveData) {
        //set unselected for client to stop rendering the selected piece
        if (socket.id === this.sockets[0].id) this.selectedPieceWhite = -1;
        else this.selectedPieceBlack = -1;


        //return if out of bounds, not playing, choose empty piece,
        // not enough players, not player's turn
        if (moveData.endRow < 0 || moveData.endRow >= Constants.NUM_TILES_HEIGHT
            || moveData.endCol < 0 || moveData.endCol >= Constants.NUM_TILES_WIDTH
            || this.board.board[moveData.startRow][moveData.startCol] === "empty"
            || !this.playing
            || this.sockets.length < 2
            || socket.id != this.turn)
            return;

        //create a temporary board to faciliatate undoing a move if it puts own king into check.
        let tempBoard = new Array(Constants.NUM_TILES_HEIGHT);
        for (let i = 0; i < tempBoard.length; i++) {
            tempBoard[i] = new Array(Constants.NUM_TILES_WIDTH);
        }

        for (let i = 0; i < tempBoard.length; i++) {
            for (let j = 0; j < tempBoard[0].length; j++) {
                tempBoard[i][j] = this.board.board[i][j];
            }
        }

        //obtain a list of all possible moves of the selected piece and make move if valid
        let possibleMoves = this.board.board[moveData.startRow][moveData.startCol].getMoves(this.board.board, moveData.startRow, moveData.startCol);
        for (let i = 0; i < possibleMoves.length; i++) {
            if (possibleMoves[i].col === moveData.endCol && possibleMoves[i].row === moveData.endRow) {
                this.board.board[moveData.endRow][moveData.endCol] = this.board.board[moveData.startRow][moveData.startCol];
                this.board.board[moveData.startRow][moveData.startCol] = "empty";
                this.turn = (this.turn === this.sockets[0].id) ? this.sockets[1].id : this.sockets[0].id;
            }
        }

        this.checkForCheckmate();

        //if player moves piece and is in check at end of turn, undo the move
        //find opposite color because already switched turn, have to revert back
        if (this.turn === this.sockets[0].id && this.kingInCheck("Black")) this.undoMove(tempBoard);
        if (this.turn === this.sockets[1].id && this.kingInCheck("White")) this.undoMove(tempBoard);
    }


    undoMove(tempBoard) {
        this.board.board = tempBoard;
        this.turn = (this.turn == this.sockets[0].id) ? this.sockets[1].id : this.sockets[0].id;
    }

    checkForCheckmate() {

    }

    findKingPosition(color) {
        for (let i = 0; i < this.board.board.length; i++) {
            for (let j = 0; j < this.board.board[0].length; j++) {
                if (this.board.board[i][j] != "empty" && this.board.board[i][j].color === color && this.board.board[i][j] instanceof King) {
                    return { row: i, col: j };
                }
            }
        }
    }

    kingInCheck(color) {
        let threatenedSquares = [];
        let kingInCheck = false;
        let oppositeColor = (color === "White") ? "Black" : "White";
        let kingPos = this.findKingPosition(color);

        for (let i = 0; i < this.board.board.length; i++) {
            for (let j = 0; j < this.board.board[0].length; j++) {
                if (this.board.board != "empty" && this.board.board[i][j].color === oppositeColor) {
                    threatenedSquares.push(this.board.board[i][j].getMoves(this.board.board, i, j));
                }
            }
        }

        threatenedSquares.forEach(moves => {
            moves.forEach(square => {
                if (square.row === kingPos.row && square.col === kingPos.col) kingInCheck = true;
            });
        });

        return kingInCheck;
    }

    serializeForUpdate() {
        return ({
            board: this.board.serializeBoard(),
            whiteID: this.white,
            turn: this.turn,
            numPlayers: this.sockets.length,
            selectedPieceWhite: this.selectedPieceWhite,
            selectedPieceBlack: this.selectedPieceBlack
        });
    }
}

module.exports = Room;