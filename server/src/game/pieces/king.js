const Constants = require("../../../constantServer.js");
const ChessPiece = require("./chessPiece.js");

class King extends ChessPiece {
    constructor(color) {
        super(color);
    }

    getMoves(board, row, col) {
        let possibleMoves = [];

        //top
        if (row - 1 >= 0 && board[row - 1][col].color != this.color) {
            possibleMoves.push({
                row: row - 1,
                col: col
            });
        }

        //top-right
        if (row - 1 >= 0 && col + 1 < Constants.NUM_TILES_WIDTH && board[row - 1][col + 1].color != this.color) {
            possibleMoves.push({
                row: row - 1,
                col: col + 1
            });
        }

        //right
        if (col + 1 < Constants.NUM_TILES_WIDTH && board[row][col + 1].color != this.color) {
            possibleMoves.push({
                row: row,
                col: col + 1
            });
        }

        //bottom-right
        if (row + 1 < Constants.NUM_TILES_HEIGHT && col + 1 < Constants.NUM_TILES_WIDTH && board[row + 1][col + 1].color != this.color) {
            possibleMoves.push({
                row: row + 1,
                col: col + 1
            });
        }

        //bottom
        if (row + 1 < Constants.NUM_TILES_HEIGHT && board[row + 1][col].color != this.color) {
            possibleMoves.push({
                row: row + 1,
                col: col
            });
        }

        //bottom-left
        if (row + 1 < Constants.NUM_TILES_HEIGHT && col - 1 >= 0 && board[row + 1][col - 1].color != this.color) {
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

        return possibleMoves;
    }
}

module.exports = King;