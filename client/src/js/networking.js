import { processGameUpdate } from "./gameUpdate.js";
import { duplicateRoom, roomFull } from "./app.js";

const PORT = "http://localhost:4000";
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
        socket.on("/roomFull", roomFull);
    });
}

export const createRoom = roomName => {
    socket.emit("/createRoom", roomName);
}

export const joinRoom = roomName => {
    socket.emit("/joinRoom", roomName);
}

export const handleInput = (e) => {
    if (e.key === "ArrowLeft") socket.emit("/input", "left");
    if (e.key === "ArrowRight") socket.emit("/input", "right");
    if (e.key === "ArrowUp") socket.emit("/input", "up");
    if (e.key === "ArrowDown") socket.emit("/input", "down");
}
