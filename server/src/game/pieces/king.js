const Constants = require("../../../constantServer.js");

class King {
    constructor(color) {
        this.color = color;
    }

    getMoves(board, row, col) {
        let possibleMoves = [];

        //king cannot put self into check
        //top
        if (row - 1 >= 0 && board[row][col])
    }
}

module.exports = King;