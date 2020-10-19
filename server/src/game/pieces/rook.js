const Constants = require("../../../constantServer.js");

class Rook {
    constructor(color) {
        this.color = color;
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

        return possibleMoves;
    }
}

module.exports = Rook;