const ChessPiece = require("./chessPiece.js");

class Pawn extends ChessPiece {
    constructor(color) {
        super(color);
    }

    //not out of bounds, no piece in front
    //not out of bounds, opposite color piece diagonal left/right
    getMoves(board, row, col, NUM_TILES_WIDTH, NUM_TILES_HEIGHT) {
        let possibleMoves = [];

        if (this.color === "White") {
            if (row - 1 >= 0 && board[row - 1][col] === "empty"
                && board[row - 1][col].color != this.color) {
                possibleMoves.push({
                    row: row - 1,
                    col: col
                });
            }

            //diagonal left
            if (row - 1 >= 0 && col - 1 >= 0 && board[row - 1][col - 1] != "empty"
                && board[row - 1][col - 1].color != this.color) {
                possibleMoves.push({
                    row: row - 1,
                    col: col - 1
                });
            }

            //diagonal right
            if (row - 1 >= 0 && col + 1 < NUM_TILES_WIDTH && board[row - 1][col + 1] != "empty"
                && board[row - 1][col + 1].color != this.color) {
                possibleMoves.push({
                    row: row - 1,
                    col: col + 1
                });
            }

            //up two squares. Feature not avaliable in long chess. Can check gamemode using NUM_TILES_WIDTH variable
            if (NUM_TILES_WIDTH === 8 && row === 6 && board[row - 1][col] === "empty" && board[row - 2][col] === "empty") {
                possibleMoves.push({
                    row: row - 2,
                    col: col
                });
            }
        } else {
            if (row + 1 < NUM_TILES_HEIGHT && board[row + 1][col] === "empty"
                && board[row + 1][col].color != this.color) {
                possibleMoves.push({
                    row: row + 1,
                    col: col
                });
            }
            //diagonal left
            if (row + 1 < NUM_TILES_HEIGHT && col - 1 >= 0 && board[row + 1][col - 1] != "empty"
                && board[row + 1][col - 1].color != this.color) {
                possibleMoves.push({
                    row: row + 1,
                    col: col - 1
                });
            }

            //diagonal right
            if (row + 1 < NUM_TILES_HEIGHT && col + 1 < NUM_TILES_WIDTH && board[row + 1][col + 1] != "empty"
                && board[row + 1][col + 1].color != this.color) {
                possibleMoves.push({
                    row: row + 1,
                    col: col + 1
                });
            }

            //up two squares. Feature not avaliable in long chess. Can check gamemode using NUM_TILES_WIDTH variable
            if (NUM_TILES_WIDTH === 8 || NUM_TILES_WIDTH === 6 && row === 1 && board[row + 1][col] === "empty" && board[row + 2][col] === "empty") {
                possibleMoves.push({
                    row: row + 2,
                    col: col
                });
            }
        }

        return possibleMoves;
    }
}

module.exports = Pawn;