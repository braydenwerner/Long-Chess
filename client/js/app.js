import { connect, createRoom, joinRoom } from "./networking.js";
import { startCaptureInput, stopCaptureInput } from "./input.js"
import { downloadAudios, downloadImages } from "./assetLoader.js";
import { startRendering } from "./render.js";
import { playMenuMusic, pauseMenuMusic } from "./playAudio.js";

const audioIcon = document.getElementById("audioIcon");

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

const standardChessMainHeader = document.getElementById("standardChessMainHeader");
const standardChessSubHeader = document.getElementById("standardChessSubHeader");
const longChessMainHeader = document.getElementById("longChessMainHeader");
const longChessSubHeader = document.getElementById("longChessSubHeader");
const instantDeathChessMainHeader = document.getElementById("instantDeathChessMainHeader");
const instantDeathChessSubHeader = document.getElementById("instantDeathChessSubHeader");

const nextPageLeft = document.getElementById("nextPageLeft");
const nextPageRight = document.getElementById("nextPageRight");

const gameModeImage = document.getElementById("gameModeImage");

export let gameMode = "standardChess";
Promise.all([connect(), downloadImages(), downloadAudios()]).then(() => {
    let totalGameModes = 3;
    let gameModeIndex = 0;
    setGameModeImage(gameModeIndex);

    nextPageLeft.onclick = () => {
        gameModeIndex--;
        if (gameModeIndex < 0) gameModeIndex = totalGameModes - 1;

        setGameModeImage(gameModeIndex);
        setGamemode(gameModeIndex);
    }

    nextPageRight.onclick = () => {
        gameModeIndex++;
        if (gameModeIndex >= totalGameModes) gameModeIndex = 0;

        setGameModeImage(gameModeIndex);
        setGamemode(gameModeIndex);
    }

    window.onresize = () => {
        setGameModeImage(gameModeIndex);
    }

    function setGameModeImage(gameModeIndex) {
        if (gameModeIndex == 0) {
            gameModeImage.src = "./Images/standardChessBoard.PNG";
            gameModeImage.style.width = window.innerWidth / 4.9 + "px";
            gameModeImage.style.height = window.innerWidth / 4.9 + "px";
        } else if (gameModeIndex == 1) {
            gameModeImage.src = "./Images/longChessBoard.PNG";
            gameModeImage.style.width = window.innerWidth / 9.8 + "px";
            gameModeImage.style.height = window.innerWidth / 4.9 + "px";
        } else if (gameModeIndex == 2) {
            gameModeImage.src = "./Images/instantDeathChessBoard.PNG";
            gameModeImage.style.width = window.innerWidth / 6.2 + "px";
            gameModeImage.style.height = window.innerWidth / 4.9 + "px";
        }
    }


    function setGamemode(gameModeIndex) {
        if (gameModeIndex == 0) {
            clearDisplays();
            gameMode = "standardChess";
            standardChessMainHeader.style.display = "initial";
            standardChessSubHeader.style.display = "initial";
        } else if (gameModeIndex == 1) {
            clearDisplays();
            gameMode = "longChess";
            longChessMainHeader.style.display = "initial";
            longChessSubHeader.style.display = "initial";
        } else if (gameModeIndex == 2) {
            clearDisplays();
            gameMode = "instantDeathChess";
            instantDeathChessMainHeader.style.display = "initial";
            instantDeathChessSubHeader.style.display = "initial";
        }
    }

    function clearDisplays() {
        standardChessMainHeader.style.display = "none";
        standardChessSubHeader.style.display = "none";
        longChessMainHeader.style.display = "none";
        longChessSubHeader.style.display = "none";
        instantDeathChessMainHeader.style.display = "none";
        instantDeathChessSubHeader.style.display = "none";
    }

    let playing = false;
    audioIcon.onclick = () => {
        playing = !playing;

        if (playing) {
            playMenuMusic();
            audioIcon.src = "./images/audioIcon.png";
        } else {
            pauseMenuMusic();
            audioIcon.src = "./images/noAudio.png";
        }
    }

    createRoomButton.onclick = () => {
        createRoomPopupOverlay.style.display = "initial";
    }

    createRoomInput.onkeyup = e => {
        if (e.key === "Enter" && validInput(createRoomInput.value)) {
            createRoomPopupOverlay.style.display = "none";
            startGame(createRoomInput.value, "create", gameMode);
        }
    }

    submitCreateRoomButton.onclick = () => {
        if (validInput(createRoomInput.value)) {
            createRoomPopupOverlay.style.display = "none";
            console.log("createRoomInput.value: " + createRoomInput.value);
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
        pauseMenuMusic();
        audioIcon.style.display = "none";

        console.log(gameMode);
        if (gameMode) {
            if (joinOption === "create") createRoom(room, gameMode);
            else if (joinOption === "join") joinRoom(room);
        } else {
            console.log("gameMode is undefined");
        }
    }
});

export function duplicateRoom() {
    display.style.display = "none";
    alert("Room already exists!");
}

export function gameAlreadyStarted() {
    display.style.display = "none";
    alert("The game has already started!");
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
