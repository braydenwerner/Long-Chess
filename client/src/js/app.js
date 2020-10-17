import { connect, createRoom, joinRoom } from "./networking.js";
import { startCaptureInput } from "./input.js"
import { startRender } from "./render.js";
import { downloadImages } from "./assetLoader.js";

const joinContainer = document.getElementById("joinContainer");
const createRoomButton = document.getElementById("createRoomButton");
const joinRoomButton = document.getElementById("joinRoomButton");
const display = document.getElementById("display");

const createRoomPopupOverlay = document.getElementById("createRoomPopupOverlay");
const createRoomInput = document.getElementById("createRoomInput");
const closeCreateRoomPopup = document.getElementById("closeCreateRoomPopup");

const joinRoomPopupOverlay = document.getElementById("joinRoomPopupOverlay");
const joinRoomInput = document.getElementById("joinRoomInput");
const closeJoinRoomPopup = document.getElementById("closeJoinRoomPopup");

Promise.all([connect(), downloadImages()]);

createRoomButton.onclick = () => {
    createRoomPopupOverlay.style.display = "initial";
}

createRoomInput.onkeyup = e => {
    //make safer, no injection of html
    if (e.key === "Enter") {
        createRoomPopupOverlay.style.display = "none";
        startGame(createRoomInput.value, "create");
    }
}

joinRoomButton.onclick = () => {
    joinRoomPopupOverlay.style.display = "initial";
}

closeCreateRoomPopup.onclick = () => {
    closeCreateRoomPopup.style.display = "none";
}

joinRoomInput.onkeyup = e => {
    //make safer, no injection of html
    if (e.key === "Enter") {
        joinRoomPopupOverlay.style.display = "none";
        startGame(joinRoomInput.value, "join");
    }
}

closeJoinRoomPopup.onclick = () => {
    joinRoomPopupOverlay.style.display = "none";
}

function startGame(room, joinOption) {
    joinContainer.style.display = "none";
    display.style.display = "initial";

    if (joinOption === "create") createRoom(room);
    else if (joinOption === "join") joinRoom(room);

    startCaptureInput();
    startRender();
}

export function duplicateRoom() {
    display.style.display = "none";
    joinContainer.style.display = "initial";
    createRoomPopupOverlay.style.display = "initial";
    alert("Room already exists!");
}

export function roomFull() {
    display.style.display = "none";
    joinContainer.style.display = "initial";
    createRoomPopupOverlay.style.display = "initial";
    alert("Room is full!");
}


