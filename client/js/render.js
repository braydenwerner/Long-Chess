import { getCurrentState } from "./gameUpdate.js";
import { NUM_TILES_WIDTH, NUM_TILES_HEIGHT } from "./constantClient.js";
import { getImages } from "./assetLoader.js";
import { socket, sendMove } from "./networking.js";

const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");
const images = getImages();

export let tileSize;
export let offsetX;
export let selectedPiece = -1;
let mousePos;
let whiteID;
let board;
let shouldDeselectPiece = false;

initMapVars();
window.onresize = () => {
    initMapVars();
}

function initMapVars() {
    canvas.width = window.innerWidth - 2;
    canvas.height = window.innerHeight - 2;
    tileSize = (canvas.height - 2) / NUM_TILES_HEIGHT;
    offsetX = canvas.width / 2 - (NUM_TILES_WIDTH / 2 * tileSize);
}

function startRendering() {
    setInterval(1000 / 60, render);
}

export function render() {
    ctx.fillStyle = "WHITE";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //current socket = socket.id
    //check if current socket matches white
    const { room } = getCurrentState();
    if (!room) return;
    whiteID = room.whiteID;
    board = room.board;

    if (shouldDeselectPiece) {
        deselectPiece();
    }

    renderBoard(board);

    if (room.numPlayers < 2) renderWaitingForPlayers();


}

function renderBoard(board) {
    //render board
    let color = "WHITE";
    for (let i = 0; i < NUM_TILES_HEIGHT; i++) {
        for (let j = 0; j < NUM_TILES_WIDTH; j++) {
            ctx.fillStyle = color;
            ctx.fillRect(j * tileSize + offsetX, i * tileSize, tileSize, tileSize);

            color = (color === "WHITE") ? "GREEN" : "WHITE";
        }

        color = (color === "WHITE") ? "GREEN" : "WHITE";
    }

    //render pieces according to player color. Board is flipped on black
    if (whiteID === socket.id) {
        for (let i = 0; i < NUM_TILES_HEIGHT; i++) {
            for (let j = 0; j < NUM_TILES_WIDTH; j++) {
                if (board[i][j] != "empty") {
                    if (i != selectedPiece.row || j != selectedPiece.col)
                        ctx.drawImage(images[board[i][j]], j * tileSize + offsetX, i * tileSize, tileSize, tileSize);
                    else
                        ctx.drawImage(images[board[i][j]], mousePos.xCord, mousePos.yCord, tileSize, tileSize);
                }
            }
        }
    } else {
        //rotate board 180 degrees
        for (let i = 0; i < NUM_TILES_HEIGHT; i++) {
            for (let j = 0; j < NUM_TILES_WIDTH; j++) {
                if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j] != "empty") {
                    if (i != NUM_TILES_HEIGHT - 1 - selectedPiece.row || j != NUM_TILES_WIDTH - 1 - selectedPiece.col)
                        ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], j * tileSize + offsetX, i * tileSize, tileSize, tileSize);
                    else
                        ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], mousePos.xCord, mousePos.yCord, tileSize, tileSize);
                }
            }
        }
    }
}

let renderWaitingForPlayersAnimation = 0;
let renderTextIndex = 0;
function renderWaitingForPlayers() {
    ctx.fillStyle = "BLACK";
    ctx.font = "32px Corrier";
    ctx.textAlign = "center";

    let texts = ["Waiting for Opponent to Connect", "Waiting for Opponent to Connect.", "Waiting for Opponent to Connect..", "Waiting for Opponent to Connect..."];
    ctx.fillText(texts[renderTextIndex], canvas.width / 2, canvas.height / 2);

    if (++renderWaitingForPlayersAnimation % 50 == 0) renderTextIndex++;
    if (renderTextIndex >= texts.length) renderTextIndex = 0;
}

export function mouseDown(e) {
    let row = Math.floor((e.clientY) / tileSize);
    let col = Math.floor((e.clientX - offsetX) / tileSize);

    //only select own color. If black, since board is flipped, selected piece if opposite
    if (row >= 0 && col >= 0 && row < NUM_TILES_HEIGHT && col < NUM_TILES_WIDTH) {
        if (board[row][col].indexOf("White") >= 0 && whiteID === socket.id) {
            selectedPiece = { row: row, col: col }
        } else if (board[NUM_TILES_HEIGHT - 1 - row][NUM_TILES_WIDTH - 1 - col].indexOf("Black") >= 0 && whiteID != socket.id) {
            selectedPiece = {
                row: NUM_TILES_HEIGHT - 1 - row,
                col: NUM_TILES_WIDTH - 1 - col
            }
        }
    }
}

//send start and ending location to server set selected piece to -1
export function mouseUp(e) {
    let row = Math.floor((mousePos.yCord + tileSize / 2) / tileSize);
    let col = Math.floor((mousePos.xCord - offsetX + tileSize / 2) / tileSize);

    if (whiteID === socket.id) {
        if (selectedPiece != -1) {
            sendMove({
                startRow: selectedPiece.row,
                startCol: selectedPiece.col,
                endRow: row,
                endCol: col
            });
        }
    } else {
        if (selectedPiece != -1) {
            sendMove({
                startRow: selectedPiece.row,
                startCol: selectedPiece.col,
                endRow: NUM_TILES_HEIGHT - 1 - row,
                endCol: NUM_TILES_WIDTH - 1 - col
            });
        }
    }

    shouldDeselectPiece = true;
}

export function mouseMove(e) {
    mousePos = { xCord: e.clientX - tileSize / 2, yCord: e.clientY - tileSize / 2 };
}

export function deselectPiece() {
    selectedPiece = -1;
    shouldDeselectPiece = false;
}