import { processGameUpdate } from "./gameUpdate.js";
import { duplicateRoom, roomFullOrNotExist, noError, whiteWins, blackWins } from "./app.js";
import { gameStart, movePiece } from "./playAudio.js";

const PORT = "https://long-chess.herokuapp.com/";
//const PORT = "http://localhost:4000";
export const socket = io(PORT);

const connectedPromise = new Promise((resolve => {
    socket.on("connect", () => {
        resolve();
    });
}));

export const connect = () => {
    connectedPromise.then(() => {
        socket.on("/gameUpdate", processGameUpdate);
        socket.on("/alreadyExists", duplicateRoom);
        socket.on("/roomFullOrNotExist", roomFullOrNotExist);
        socket.on("/noError", noError);
        socket.on("/whiteWins", whiteWins);
        socket.on("/blackWins", blackWins);

        socket.on("/gameStartAudio", gameStart);
        socket.on("/movePieceAudio", movePiece);
    });
}

export const createRoom = roomName => {
    socket.emit("/createRoom", roomName);
}

export const joinRoom = roomName => {
    socket.emit("/joinRoom", roomName);
}

export const sendMove = moveData => {
    socket.emit("/sendMove", moveData)
}

export const selectPiece = (piece) => {
    socket.emit("/selectPiece", piece);
}
