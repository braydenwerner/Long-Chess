const ChessPiece = require("./chessPiece.js");
const Rook = require("./rook.js");

class King extends ChessPiece {
    constructor(color) {
        super(color);

        this.hasBeenInCheck = false;
        this.hasMoved = false;
    }

    getMoves(board, row, col, NUM_TILES_WIDTH, NUM_TILES_HEIGHT) {
        let possibleMoves = [];

        //top
        if (row - 1 >= 0 && board[row - 1][col].color != this.color) {
            possibleMoves.push({
                row: row - 1,
                col: col
            });
        }

        //top-right
        if (row - 1 >= 0 && col + 1 < NUM_TILES_WIDTH && board[row - 1][col + 1].color != this.color) {
            possibleMoves.push({
                row: row - 1,
                col: col + 1
            });
        }

        //right
        if (col + 1 < NUM_TILES_WIDTH && board[row][col + 1].color != this.color) {
            possibleMoves.push({
                row: row,
                col: col + 1
            });
        }

        //bottom-right
        if (row + 1 < NUM_TILES_HEIGHT && col + 1 < NUM_TILES_WIDTH && board[row + 1][col + 1].color != this.color) {
            possibleMoves.push({
                row: row + 1,
                col: col + 1
            });
        }

        //bottom
        if (row + 1 < NUM_TILES_HEIGHT && board[row + 1][col].color != this.color) {
            possibleMoves.push({
                row: row + 1,
                col: col
            });
        }

        //bottom-left
        if (row + 1 < NUM_TILES_HEIGHT && col - 1 >= 0 && board[row + 1][col - 1].color != this.color) {
            possibleMoves.push({
                row: row + 1,
                col: col - 1
            });
        }

        //left
        if (col - 1 >= 0 && board[row][col - 1].color != this.color) {
            possibleMoves.push({
                row: row,
                col: col - 1
            });
        }

        //top-left
        if (row - 1 >= 0 && col - 1 >= 0 && board[row - 1][col - 1].color != this.color) {
            possibleMoves.push({
                row: row - 1,
                col: col - 1
            });
        }

        //castle
        if (NUM_TILES_WIDTH === 8 && !this.hasBeenInCheck && !this.hasMoved) {
            if (this.color === "White" && row === 7 && col === 4) {
                if (board[7][0] instanceof Rook && board[7][0].color === "White"
                    && board[7][3] === "empty" && board[7][2] === "empty" && board[7][1] === "empty") {
                    possibleMoves.push({
                        isCastle: true,
                        row: 7,
                        col: 2,
                        startRookRow: 7,
                        startRookCol: 0,
                        endRookRow: 7,
                        endRookCol: 3
                    });
                }

                if (board[7][7] instanceof Rook && board[7][7].color === "White"
                    && board[7][5] === "empty" && board[7][6] === "empty") {
                    possibleMoves.push({
                        isCastle: true,
                        row: 7,
                        col: 6,
                        startRookRow: 7,
                        startRookCol: 7,
                        endRookRow: 7,
                        endRookCol: 5
                    });
                }
            } else {
                if (board[0][0] instanceof Rook && board[0][0].color === "Black"
                    && board[0][3] === "empty" && board[0][2] === "empty" && board[0][1] === "empty") {
                    possibleMoves.push({
                        isCastle: true,
                        row: 0,
                        col: 2,
                        startRookRow: 0,
                        startRookCol: 0,
                        endRookRow: 0,
                        endRookCol: 3
                    });
                }

                if (board[0][7] instanceof Rook && board[0][7].color === "Black"
                    && board[0][5] === "empty" && board[0][6] === "empty") {
                    possibleMoves.push({
                        isCastle: true,
                        row: 0,
                        col: 6,
                        startRookRow: 0,
                        startRookCol: 7,
                        endRookRow: 0,
                        endRookCol: 5
                    });
                }
            }
        }

        return possibleMoves;
    }
}

module.exports = King;