const Bishop = require("./pieces/bishop");
const board = require("./pieces/initBoard");
const King = require("./pieces/king");
const Knight = require("./pieces/knight");
const Pawn = require("./pieces/pawn");
const Queen = require("./pieces/queen");
const Rook = require("./pieces/rook");

class Board {
    constructor() {
        this.board = board;
    }

    serializeBoard() {
        //return a board of all string values to render clientside
        let clientBoard = new Array(8);
        for (let i = 0; i < clientBoard.length; i++) {
            clientBoard[i] = new Array(8);
        }

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                if (this.board[i][j] instanceof Bishop) clientBoard[i][j] = { type: "bishop", color: this.board[i][j].color };
                else if (this.board[i][j] instanceof King) clientBoard[i][j] = { type: "king", color: this.board[i][j].color };
                else if (this.board[i][j] instanceof Knight) clientBoard[i][j] = { type: "knight", color: this.board[i][j].color };
                else if (this.board[i][j] instanceof Pawn) clientBoard[i][j] = { type: "pawn", color: this.board[i][j].color };
                else if (this.board[i][j] instanceof Queen) clientBoard[i][j] = { type: "queen", color: this.board[i][j].color };
                else if (this.board[i][j] instanceof Rook) clientBoard[i][j] = { type: "rook", color: this.board[i][j].color };
                else clientBoard[i][j] = "empty";
            }
        }

        return clientBoard;
    }
}

module.exports = Board;