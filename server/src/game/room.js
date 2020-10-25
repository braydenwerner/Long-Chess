const Board = require("./board");
const Constants = require("../../constantServer.js");
const King = require("./pieces/king");

class Room {
    constructor(roomName) {
        this.roomName = roomName;
        this.sockets = [];

        this.selectedPieceWhite = -1;
        this.selectedPieceBlack = -1;

        this.playing = false;
        this.turn;
        this.white;

        this.board = new Board();
    }

    addSocket(socket) {
        this.sockets.push(socket);
        if (this.sockets.length === 1) this.white = this.sockets[0].id;
    }

    removeSocket(socket) {
        this.sockets = this.sockets.filter(s => socket != s);
    }

    update() {
        if (!this.playing && this.sockets.length == 2) {
            this.playing = true;
            this.turn = this.sockets[0].id;

            this.sockets[0].emit("/gameStartAudio");
            this.sockets[1].emit("/gameStartAudio");
        }
    }

    selectPiece(socket, piece) {
        if (this.playing && socket.id === this.sockets[0].id) this.selectedPieceWhite = piece;
        else if (this.playing && socket.id === this.sockets[1].id) this.selectedPieceBlack = piece;
    }

    makeMove(socket, moveData) {
        //return if out of bounds, not playing, choose empty piece,
        // not enough players, not player's turn
        if (moveData.endRow < 0 || moveData.endRow >= Constants.NUM_TILES_HEIGHT
            || moveData.endCol < 0 || moveData.endCol >= Constants.NUM_TILES_WIDTH
            || this.board.board[moveData.startRow][moveData.startCol] === "empty"
            || !this.playing
            || this.sockets.length < 2
            || socket.id != this.turn) {
            if (socket.id === this.sockets[0].id) this.selectedPieceWhite = -1;
            else this.selectedPieceBlack = -1;
            return;
        }

        //create a temporary board to faciliatate undoing a move if it puts own king into check.
        let tempBoard = new Array(Constants.NUM_TILES_HEIGHT);
        for (let i = 0; i < tempBoard.length; i++) {
            tempBoard[i] = new Array(Constants.NUM_TILES_WIDTH);
        }

        for (let i = 0; i < tempBoard.length; i++) {
            for (let j = 0; j < tempBoard[0].length; j++) {
                tempBoard[i][j] = this.board.board[i][j];
            }
        }

        //obtain a list of all possible moves of the selected piece and make move if valid
        let possibleMoves = this.board.board[moveData.startRow][moveData.startCol].getMoves(this.board.board, moveData.startRow, moveData.startCol);
        for (let i = 0; i < possibleMoves.length; i++) {
            if (possibleMoves[i].col === moveData.endCol && possibleMoves[i].row === moveData.endRow) {
                this.board.board[moveData.endRow][moveData.endCol] = this.board.board[moveData.startRow][moveData.startCol];
                this.board.board[moveData.startRow][moveData.startCol] = "empty";
                this.turn = (this.turn === this.sockets[0].id) ? this.sockets[1].id : this.sockets[0].id;
            }
        }

        let whiteKingPos = this.findKingPosition(this.board.board, "White");
        let blackKingPos = this.findKingPosition(this.board.board, "Black");

        let inCheckWhite = this.kingInCheck(this.board.board, "White", whiteKingPos);
        let inCheckBlack = this.kingInCheck(this.board.board, "Black", blackKingPos);

        if (this.turn === this.sockets[1].id && inCheckBlack && this.isCheckmate("Black")) {
            this.sockets[0].emit("/whiteWins");
            this.sockets[1].emit("/whiteWins");
        }

        if (this.turn === this.sockets[0].id && inCheckWhite && this.isCheckmate("White")) {
            this.sockets[0].emit("/blackWins");
            this.sockets[1].emit("/blackWins");
        }

        //if player moves piece and is in check at end of turn, undo the move
        //find opposite color because already switched turn, have to revert back
        if (this.turn === this.sockets[0].id && inCheckBlack) this.undoMove(tempBoard);
        if (this.turn === this.sockets[1].id && inCheckWhite) this.undoMove(tempBoard);

        //play move audio
        this.sockets[0].emit("/movePieceAudio");
        this.sockets[1].emit("/movePieceAudio");

        if (socket.id === this.sockets[0].id) this.selectedPieceWhite = -1;
        else this.selectedPieceBlack = -1;
    }


    undoMove(tempBoard) {
        this.board.board = tempBoard;
        this.turn = (this.turn == this.sockets[0].id) ? this.sockets[1].id : this.sockets[0].id;
    }

    isCheckmate(color) {
        //loop through all peices of a given color and see if still in check
        let tempBoard = new Array(Constants.NUM_TILES_HEIGHT);
        for (let i = 0; i < tempBoard.length; i++) {
            tempBoard[i] = new Array(Constants.NUM_TILES_WIDTH);
        }

        for (let i = 0; i < tempBoard.length; i++) {
            for (let j = 0; j < tempBoard[0].length; j++) {
                tempBoard[i][j] = this.board.board[i][j];
            }
        }

        for (let i = 0; i < tempBoard.length; i++) {
            for (let j = 0; j < tempBoard[0].length; j++) {
                if (tempBoard[i][j].color === color) {
                    let possibleMoves = tempBoard[i][j].getMoves(tempBoard, i, j);
                    //make the move and see if still in check
                    for (let k = 0; k < possibleMoves.length; k++) {
                        tempBoard[possibleMoves[k].row][possibleMoves[k].col] = tempBoard[i][j];
                        tempBoard[i][j] = "empty";

                        //update king position in the event that the king needs to move out of check
                        if (!this.kingInCheck(tempBoard, color, this.findKingPosition(tempBoard, color)))
                            return false;

                        //reset the board
                        for (let i = 0; i < tempBoard.length; i++) {
                            for (let j = 0; j < tempBoard[0].length; j++) {
                                tempBoard[i][j] = this.board.board[i][j];
                            }
                        }
                    }
                }
            }
        }

        return true;
    }

    findKingPosition(board, color) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] != "empty" && board[i][j].color === color && board[i][j] instanceof King) {
                    return { row: i, col: j };
                }
            }
        }
    }

    kingInCheck(board, color, kingPos) {
        let threatenedSquares = [];
        let kingInCheck = false;
        let oppositeColor = (color === "White") ? "Black" : "White";

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board != "empty" && board[i][j].color === oppositeColor) {
                    threatenedSquares.push(board[i][j].getMoves(board, i, j));
                }
            }
        }

        threatenedSquares.forEach(moves => {
            moves.forEach(square => {
                if (square.row === kingPos.row && square.col === kingPos.col) kingInCheck = true;
            });
        });

        return kingInCheck;
    }

    serializeForUpdate() {
        return ({
            board: this.board.serializeBoard(),
            whiteID: this.white,
            turn: this.turn,
            numPlayers: this.sockets.length,
            selectedPieceWhite: this.selectedPieceWhite,
            selectedPieceBlack: this.selectedPieceBlack
        });
    }
}

module.exports = Room;