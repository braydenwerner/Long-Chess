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

        //find all threatened squares
        let threatenedSquares = [];
        if (this.color === "White") {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[0].length; j++) {
                    if (board != "empty" && board[i][j].color === "Black" && !(board[i][j] instanceof King))
                        threatenedSquares.push(board[i][j].getMoves(board, i, j));
                }
            }
        } else {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[0].length; j++) {
                    if (board != "empty" && board[i][j].color === "White" && !(board[i][j] instanceof King))
                        threatenedSquares.push(board[i][j].getMoves(board, i, j));
                }
            }
        }

        threatenedSquares.forEach(moves => {
            moves.forEach(square => {
                for (let i = 0; i < possibleMoves.length; i++) {
                    if (possibleMoves.row === square.row && possibleMoves.col === square.col) {
                        possibleMoves.splice(i, 1);
                        i--;
                    }
                }
            });
        });

        return possibleMoves;
    }
}

module.exports = King;