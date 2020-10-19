const { NUM_TILES_HEIGHT } = require("../../../constantServer.js");
const Constants = require("../../../constantServer.js");

class Pawn {
    constructor(color) {
        this.color = color;
    }

    //not out of bounds, no piece in front
    //not out of bounds, opposite color piece diagonal left/right
    getMoves(board, row, col) {
        let possibleMoves = [];

        if (this.color === "White") {
            if (row - 1 >= 0 && board[row - 1][col] === "empty") {
                possibleMoves.push({
                    row: row - 1,
                    col: col
                });
            }

            //diagonal left
            if (row - 1 >= 0 && col - 1 >= 0 && board[row - 1][col - 1] != "empty") {
                possibleMoves.push({
                    row: row - 1,
                    col: col - 1
                });
            }

            //diagonal right
            if (row - 1 >= 0 && col + 1 < Constants.NUM_TILES_WIDTH && board[row - 1][col + 1] != "empty") {
                possibleMoves.push({
                    row: row - 1,
                    col: col + 1
                })
            }
        } else {
            if (row + 1 < Constants.NUM_TILES_HEIGHT && board[row + 1][col] === "empty") {
                possibleMoves.push({
                    row: row + 1,
                    col: col
                });
            }

            //diagonal left
            if (row + 1 < NUM_TILES_HEIGHT && col - 1 >= 0 && board[row + 1][col - 1] != "empty") {
                possibleMoves.push({
                    row: row + 1,
                    col: col - 1
                });
            }

            //diagonal right
            if (row + 1 < NUM_TILES_HEIGHT && col + 1 < Constants.NUM_TILES_WIDTH && board[row + 1][col + 1] != "empty") {
                possibleMoves.push({
                    row: row + 1,
                    col: col + 1
                })
            }
        }

        return possibleMoves;
    }
}

module.exports = Pawn;