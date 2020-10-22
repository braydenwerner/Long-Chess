const Constants = require("../../../constantServer.js");
const ChessPiece = require("./chessPiece.js");

class Queen extends ChessPiece {
    constructor(color) {
        super(color);
    }

    getMoves(board, row, col) {
        let possibleMoves = [];

        //top  
        let tempRow = row;
        while (tempRow - 1 >= 0 && board[tempRow - 1][col].color != this.color) {
            possibleMoves.push({
                row: --tempRow,
                col: col
            });

            if (board[tempRow][col] != "empty") break;
        }

        //right
        let tempCol = col;
        while (tempCol + 1 < Constants.NUM_TILES_WIDTH && board[row][tempCol + 1].color != this.color) {
            possibleMoves.push({
                row: row,
                col: ++tempCol
            });

            if (board[row][tempCol] != "empty") break;
        }

        //bottom
        tempRow = row;
        while (tempRow + 1 < Constants.NUM_TILES_HEIGHT && board[tempRow + 1][col].color != this.color) {
            possibleMoves.push({
                row: ++tempRow,
                col: col
            });

            if (board[tempRow][col] != "empty") break;
        }

        //left
        tempCol = col;
        while (tempCol - 1 >= 0 && board[row][tempCol - 1].color != this.color) {
            possibleMoves.push({
                row: row,
                col: --tempCol
            });

            if (board[row][tempCol] != "empty") break;
        }

        //diagonal up left
        tempRow = row;
        tempCol = col;
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

module.exports = Queen;