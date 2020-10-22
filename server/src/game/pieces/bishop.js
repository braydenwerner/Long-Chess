const Constants = require("../../../constantServer.js");
const ChessPiece = require("./chessPiece.js");

class Bishop extends ChessPiece {
    constructor(color) {
        super(color);
    }

    getMoves(board, row, col) {
        let possibleMoves = [];

        //diagonal up left
        let tempRow = row;
        let tempCol = col;
        while (tempRow - 1 >= 0 && tempCol - 1 >= 0
            && board[tempRow - 1][tempCol - 1].color != this.color) {
            possibleMoves.push({
                row: --tempRow,
                col: --tempCol
            });

            if (board[tempRow][tempCol] != "empty") break;
        }

        //diagonal up right
        tempRow = row;
        tempCol = col;
        while (tempRow - 1 >= 0 && tempCol + 1 < Constants.NUM_TILES_WIDTH
            && board[tempRow - 1][tempCol + 1].color != this.color) {
            possibleMoves.push({
                row: --tempRow,
                col: ++tempCol
            });

            if (board[tempRow][tempCol] != "empty") break;
        }

        //diagonal down left
        tempRow = row;
        tempCol = col;
        while (tempRow + 1 < Constants.NUM_TILES_HEIGHT && tempCol - 1 >= 0
            && board[tempRow + 1][tempCol - 1].color != this.color) {
            possibleMoves.push({
                row: ++tempRow,
                col: --tempCol
            });

            if (board[tempRow][tempCol] != "empty") break;
        }

        //diagonal down right
        tempRow = row;
        tempCol = col;
        while (tempRow + 1 < Constants.NUM_TILES_HEIGHT && tempCol + 1 < Constants.NUM_TILES_WIDTH
            && board[tempRow + 1][tempCol + 1].color != this.color) {
            possibleMoves.push({
                row: ++tempRow,
                col: ++tempCol
            });

            if (board[tempRow][tempCol] != "empty") break;
        }

        return possibleMoves;
    }
}

module.exports = Bishop;