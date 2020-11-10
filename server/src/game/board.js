const Bishop = require("./pieces/bishop");
const King = require("./pieces/king");
const Knight = require("./pieces/knight");
const Pawn = require("./pieces/pawn");
const Queen = require("./pieces/queen");
const Rook = require("./pieces/rook");

class Board {
    constructor(gameMode) {
        if (gameMode === "standardChess") {
            this.NUM_TILES_WIDTH = 8;
            this.NUM_TILES_HEIGHT = 8;
            this.board = [[new Rook("Black"), new Knight("Black"), new Bishop("Black"), new Queen("Black"), new King("Black"), new Bishop("Black"), new Knight("Black"), new Rook("Black")],
            [new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black")],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            [new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White")],
            [new Rook("White"), new Knight("White"), new Bishop("White"), new Queen("White"), new King("White"), new Bishop("White"), new Knight("White"), new Rook("White")]];
        } else if (gameMode === "longChess") {
            this.NUM_TILES_WIDTH = 4;
            this.NUM_TILES_HEIGHT = 8;
            this.board = [[new Rook("Black"), new Queen("Black"), new King("Black"), new Rook("Black")],
            [new Bishop("Black"), new Knight("Black"), new Knight("Black"), new Bishop("Black")],
            [new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black")],
            ["empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty"],
            [new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White")],
            [new Bishop("White"), new Knight("White"), new Knight("White"), new Bishop("White")],
            [new Rook("White"), new Queen("White"), new King("White"), new Rook("White")]];
        } else if (gameMode === "instantDeathChess") {
            this.NUM_TILES_WIDTH = 6;
            this.NUM_TILES_HEIGHT = 8;
            this.board = [[new Rook("Black"), new Bishop("Black"), new Queen("Black"), new King("Black"), new Bishop("Black"), new Rook("Black")],
            [new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black")],
            ["empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty"],
            [new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White")],
            [new Rook("White"), new Bishop("White"), new Queen("White"), new King("White"), new Bishop("White"), new Rook("White")]];
        } else {
            this.NUM_TILES_WIDTH = 8;
            this.NUM_TILES_HEIGHT = 1;
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
        }
    }

    serializeBoard() {
        //return a board of all string values to render clientside
        let clientBoard = new Array(this.NUM_TILES_HEIGHT);
        for (let i = 0; i < clientBoard.length; i++) {
            clientBoard[i] = new Array(this.NUM_TILES_WIDTH);
        }

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                if (this.board[i][j] instanceof Bishop) clientBoard[i][j] = "bishop" + this.board[i][j].color + ".png";
                else if (this.board[i][j] instanceof King) clientBoard[i][j] = "king" + this.board[i][j].color + ".png";
                else if (this.board[i][j] instanceof Knight) clientBoard[i][j] = "knight" + this.board[i][j].color + ".png";
                else if (this.board[i][j] instanceof Pawn) clientBoard[i][j] = "pawn" + this.board[i][j].color + ".png";
                else if (this.board[i][j] instanceof Queen) clientBoard[i][j] = "queen" + this.board[i][j].color + ".png";
                else if (this.board[i][j] instanceof Rook) clientBoard[i][j] = "rook" + this.board[i][j].color + ".png";
                else clientBoard[i][j] = "empty";
            }
        }

        return clientBoard;
    }
}

module.exports = Board;