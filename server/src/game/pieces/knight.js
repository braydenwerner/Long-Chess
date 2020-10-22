const Constants = require("../../../constantServer.js");
const ChessPiece = require("./chessPiece.js");

class Knight extends ChessPiece {
    constructor(color) {
        super(color);
    }

    //if not out of bounds, can jump 8 directions
    getMoves(board, row, col) {
        let possibleMoves = [];

        //moves for horses are same, doesn't matter if white or black
        //top
        if (row - 2 >= 0 && col - 1 >= 0
            && board[row - 2][col - 1].color != this.color) {
            possibleMoves.push({
                row: row - 2,
                col: col - 1
            });
        }

        if (row - 2 >= 0 && col + 1 < Constants.NUM_TILES_WIDTH
            && board[row - 2][col + 1].color != this.color) {
            possibleMoves.push({
                row: row - 2,
                col: col + 1
            })
        }

        //right
        if (row - 1 >= 0 && col + 2 < Constants.NUM_TILES_WIDTH
            && board[row - 1][col + 2].color != this.color) {
            possibleMoves.push({
                row: row - 1,
                col: col + 2
            });
        }

        if (row + 1 < Constants.NUM_TILES_HEIGHT && col + 2 < Constants.NUM_TILES_WIDTH
            && board[row + 1][col + 2].color != this.color) {
            possibleMoves.push({
                row: row + 1,
                col: col + 2
            });
        }

        //bottom
        if (row + 2 < Constants.NUM_TILES_HEIGHT && col + 1 < Constants.NUM_TILES_WIDTH
            && board[row + 2][col + 1].color != this.color) {
            possibleMoves.push({
                row: row + 2,
                col: col + 1
            });
        }

        if (row + 2 < Constants.NUM_TILES_HEIGHT && col - 1 >= 0
            && board[row + 2][col - 1].color != this.color) {
            possibleMoves.push({
                row: row + 2,
                col: col - 1
            });
        }

        //left
        if (row + 1 < Constants.NUM_TILES_HEIGHT && col - 2 >= 0
            && board[row + 1][col - 2].color != this.color) {
            possibleMoves.push({
                row: row + 1,
                col: col - 2
            });
        }

        if (row - 1 >= 0 && col - 2 >= 0
            && board[row - 1][col - 2].color != this.color) {
            possibleMoves.push({
                row: row - 1,
                col: col - 2
            });
        }

        return possibleMoves;
    }
}

module.exports = Knight;