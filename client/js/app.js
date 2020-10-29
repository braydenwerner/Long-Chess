import { connect, createRoom, joinRoom } from "./networking.js";
import { startCaptureInput, stopCaptureInput } from "./input.js"
import { downloadAudios, downloadImages } from "./assetLoader.js";
import { startRendering } from "./render.js";

const joinContainer = document.getElementById("joinContainer");
const createRoomButton = document.getElementById("createRoomButton");
const joinRoomButton = document.getElementById("joinRoomButton");
const display = document.getElementById("display");

const createRoomPopupOverlay = document.getElementById("createRoomPopupOverlay");
const createRoomInput = document.getElementById("createRoomInput");
const submitCreateRoomButton = document.getElementById("submitCreateRoomButton");
const closeCreateRoomPopup = document.getElementById("closeCreateRoomPopup");

const joinRoomPopupOverlay = document.getElementById("joinRoomPopupOverlay");
const joinRoomInput = document.getElementById("joinRoomInput");
const closeJoinRoomPopup = document.getElementById("closeJoinRoomPopup");

const winScreenPopupOverlay = document.getElementById("winScreenPopupOverlay");
const winMessage = document.getElementById("winMessage");
const backToHomeButton = document.getElementById("backToHomeButton");
//const rematchButton = document.getElementById("rematchButton");

Promise.all([connect(), downloadImages(), downloadAudios()]);

createRoomButton.onclick = () => {
    createRoomPopupOverlay.style.display = "initial";
}

export let gameMode = "standardChess";
createRoomInput.onkeyup = e => {
    if (e.key === "Enter" && validInput(createRoomInput.value)) {
        createRoomPopupOverlay.style.display = "none";
        startGame(createRoomInput.value, "create", gameMode);
    }
}

submitCreateRoomButton.onclick = () => {
    if (validInput(createRoomInput.value)) {
        createRoomPopupOverlay.style.display = "none";
        startGame(createRoomInput.value, "create");
    }
}

closeCreateRoomPopup.onclick = () => {
    createRoomPopupOverlay.style.display = "none";
}

joinRoomButton.onclick = () => {
    joinRoomPopupOverlay.style.display = "initial";
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

function validInput(input) {
    let valid = /^[0-9a-zA-Z]+$/;
    if (input.match(valid)) return true;
    else {
        alert("Room codes must only contain letters and digits.");
        return false;
    }
}

function startGame(room, joinOption, gameMode) {
    if (joinOption === "create") createRoom(room, gameMode);
    else if (joinOption === "join") joinRoom(room);
}

export function duplicateRoom() {
    display.style.display = "none";
    alert("Room already exists!");
}

export function roomFullOrNotExist() {
    display.style.display = "none";
    alert("Room is full or does not exist!");
}

//if game can start
export function noError() {
    joinContainer.style.display = "none";
    display.style.display = "initial";

    startCaptureInput();
    startRendering();
}

backToHomeButton.onclick = () => {
    location.reload();
}

export function whiteWins() {
    stopCaptureInput();
    winScreenPopupOverlay.style.display = "initial";
    winMessage.innerText = "White Wins";
}

export function blackWins() {
    stopCaptureInput();
    winScreenPopupOverlay.style.display = "initial";
    winMessage.innerText = "Black Wins";
}


