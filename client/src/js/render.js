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

export function startRender() {
    setInterval(render, 1000 / 60);
}

function render() {
    ctx.fillStyle = "WHITE";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //current socket = socket.id
    //check if current socket matches white
    //console.log(getCurrentState().room.white === socket.id);

    const { room } = getCurrentState();
    if (!room) return;
    whiteID = room.whiteID;
    board = room.board;

    renderBoard(board);
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

    //render pieces
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
}

export function mouseDown(e) {
    let row = Math.floor((e.clientY) / tileSize);
    let col = Math.floor((e.clientX - offsetX) / tileSize);

    //only select own color
    if ((board[row][col].indexOf("White") >= 0 && whiteID === socket.id)
        || (board[row][col].indexOf("Black") >= 0 && whiteID != socket.id))
        selectedPiece = { row: row, col: col }
}

//send start and ending location to server set selected piece to -1
export function mouseUp(e) {
    let row = Math.floor((mousePos.yCord + tileSize / 2) / tileSize);
    let col = Math.floor((mousePos.xCord - offsetX + tileSize / 2) / tileSize);

    if (selectedPiece != -1) {
        sendMove({
            startRow: selectedPiece.row,
            startCol: selectedPiece.col,
            endRow: row,
            endCol: col
        });
    }
}

export function mouseMove(e) {
    mousePos = { xCord: e.clientX - tileSize / 2, yCord: e.clientY - tileSize / 2 };
}

export function invalidMove() {
    console.log("invalid move reached");
    selectedPiece = -1;
}