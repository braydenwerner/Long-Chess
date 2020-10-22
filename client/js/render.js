import { getCurrentState } from "./gameUpdate.js";
import {
    NUM_TILES_WIDTH, NUM_TILES_HEIGHT, PAWN_WIDTH, PAWN_HEIGHT, ROOK_HEIGHT, ROOK_WIDTH, KNIGHT_WIDTH,
    KNIGHT_HEIGHT, BISHOP_WIDTH, BISHOP_HEIGHT, QUEEN_WIDTH, QUEEN_HEIGHT, KING_WIDTH, KING_HEIGHT
} from "./constantClient.js";
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
    canvas.height = window.innerHeight - 40;
    tileSize = (canvas.height - 2) / NUM_TILES_HEIGHT;
    offsetX = canvas.width / 2 - (NUM_TILES_WIDTH / 2 * tileSize);
}

export function startRendering() {
    setInterval(render, 1000 / 60);
}

export function render() {
    ctx.fillStyle = "#292d3e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { room } = getCurrentState();
    if (!room) return;
    whiteID = room.whiteID;
    board = room.board;

    if (shouldDeselectPiece) deselectPiece();

    //RENDER BOARD AFTER AN UPDATE, RENDER SELECTED PIECE SEPARATELY????
    renderBoard(board);

    if (room.numPlayers < 2) renderWaitingForPlayers();
}

function renderBoard(board) {
    //render board
    let color = "#eeeed2";
    for (let i = 0; i < NUM_TILES_HEIGHT; i++) {
        for (let j = 0; j < NUM_TILES_WIDTH; j++) {
            ctx.fillStyle = color;
            ctx.fillRect(j * tileSize + offsetX, i * tileSize, tileSize, tileSize);

            color = (color === "#eeeed2") ? "#769656" : "#eeeed2";
        }

        color = (color === "#eeeed2") ? "#769656" : "#eeeed2";
    }

    //render pieces according to player color. Board is flipped on black
    if (whiteID === socket.id) {
        for (let i = 0; i < NUM_TILES_HEIGHT; i++) {
            for (let j = 0; j < NUM_TILES_WIDTH; j++) {
                if (board[i][j] != "empty") {
                    if (i != selectedPiece.row || j != selectedPiece.col) {
                        //center point pawnWidth / 2 + tileSize / 2 
                        if (board[i][j].indexOf("pawn") >= 0)
                            ctx.drawImage(images[board[i][j]], j * tileSize + offsetX + tileSize / 2 - PAWN_WIDTH / 2, i * tileSize + tileSize / 2 - PAWN_HEIGHT / 2, PAWN_WIDTH, PAWN_HEIGHT);
                        else if (board[i][j].indexOf("rook") >= 0)
                            ctx.drawImage(images[board[i][j]], j * tileSize + offsetX + tileSize / 2 - ROOK_WIDTH / 2, i * tileSize + tileSize / 2 - ROOK_HEIGHT / 2, ROOK_WIDTH, ROOK_HEIGHT);
                        else if (board[i][j].indexOf("knight") >= 0)
                            ctx.drawImage(images[board[i][j]], j * tileSize + offsetX + tileSize / 2 - KNIGHT_WIDTH / 2, i * tileSize + tileSize / 2 - KNIGHT_HEIGHT / 2, KNIGHT_WIDTH, KNIGHT_HEIGHT);
                        else if (board[i][j].indexOf("bishop") >= 0)
                            ctx.drawImage(images[board[i][j]], j * tileSize + offsetX + tileSize / 2 - BISHOP_WIDTH / 2, i * tileSize + tileSize / 2 - BISHOP_HEIGHT / 2, BISHOP_WIDTH, BISHOP_HEIGHT);
                        else if (board[i][j].indexOf("king") >= 0)
                            ctx.drawImage(images[board[i][j]], j * tileSize + offsetX + tileSize / 2 - KING_WIDTH / 2, i * tileSize + tileSize / 2 - KING_HEIGHT / 2, KING_WIDTH, KING_HEIGHT);
                        else if (board[i][j].indexOf("queen") >= 0)
                            ctx.drawImage(images[board[i][j]], j * tileSize + offsetX + tileSize / 2 - QUEEN_WIDTH / 2, i * tileSize + tileSize / 2 - QUEEN_HEIGHT / 2, QUEEN_WIDTH, QUEEN_HEIGHT);
                    } else {
                        if (board[i][j].indexOf("pawn") >= 0)
                            ctx.drawImage(images[board[i][j]], mousePos.xCord + PAWN_WIDTH / 2, mousePos.yCord, PAWN_WIDTH, PAWN_HEIGHT);
                        else if (board[i][j].indexOf("rook") >= 0)
                            ctx.drawImage(images[board[i][j]], mousePos.xCord + ROOK_WIDTH / 2, mousePos.yCord, ROOK_WIDTH, ROOK_HEIGHT);
                        else if (board[i][j].indexOf("knight") >= 0)
                            ctx.drawImage(images[board[i][j]], mousePos.xCord + KNIGHT_WIDTH / 2, mousePos.yCord, KNIGHT_WIDTH, KNIGHT_HEIGHT);
                        else if (board[i][j].indexOf("bishop") >= 0)
                            ctx.drawImage(images[board[i][j]], mousePos.xCord + BISHOP_WIDTH / 2, mousePos.yCord, BISHOP_WIDTH, BISHOP_HEIGHT);
                        else if (board[i][j].indexOf("king") >= 0)
                            ctx.drawImage(images[board[i][j]], mousePos.xCord + KING_WIDTH / 2, mousePos.yCord, KING_WIDTH, KING_HEIGHT);
                        else if (board[i][j].indexOf("queen") >= 0)
                            ctx.drawImage(images[board[i][j]], mousePos.xCord + QUEEN_WIDTH / 2, mousePos.yCord, QUEEN_WIDTH, QUEEN_HEIGHT);
                    }
                }
            }
        }
    } else {
        //rotate board 180 degrees
        for (let i = 0; i < NUM_TILES_HEIGHT; i++) {
            for (let j = 0; j < NUM_TILES_WIDTH; j++) {
                if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j] != "empty") {
                    if (i != NUM_TILES_HEIGHT - 1 - selectedPiece.row || j != NUM_TILES_WIDTH - 1 - selectedPiece.col) {
                        if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j].indexOf("pawn") >= 0)
                            ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], j * tileSize + offsetX + tileSize / 2 - PAWN_WIDTH / 2, i * tileSize + tileSize / 2 - PAWN_HEIGHT / 2, PAWN_WIDTH, PAWN_HEIGHT);
                        else if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j].indexOf("rook") >= 0)
                            ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], j * tileSize + offsetX + tileSize / 2 - ROOK_WIDTH / 2, i * tileSize + tileSize / 2 - ROOK_HEIGHT / 2, ROOK_WIDTH, ROOK_HEIGHT);
                        else if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j].indexOf("knight") >= 0)
                            ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], j * tileSize + offsetX + tileSize / 2 - KNIGHT_WIDTH / 2, i * tileSize + tileSize / 2 - KNIGHT_HEIGHT / 2, KNIGHT_WIDTH, KNIGHT_HEIGHT);
                        else if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j].indexOf("bishop") >= 0)
                            ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], j * tileSize + offsetX + tileSize / 2 - BISHOP_WIDTH / 2, i * tileSize + tileSize / 2 - BISHOP_HEIGHT / 2, BISHOP_WIDTH, BISHOP_HEIGHT);
                        else if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j].indexOf("king") >= 0)
                            ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], j * tileSize + offsetX + tileSize / 2 - KING_WIDTH / 2, i * tileSize + tileSize / 2 - KING_HEIGHT / 2, KING_WIDTH, KING_HEIGHT);
                        else if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j].indexOf("queen") >= 0)
                            ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], j * tileSize + offsetX + tileSize / 2 - QUEEN_WIDTH / 2, i * tileSize + tileSize / 2 - QUEEN_HEIGHT / 2, QUEEN_WIDTH, QUEEN_HEIGHT);
                    } else {
                        if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j].indexOf("pawn") >= 0)
                            ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], mousePos.xCord + PAWN_WIDTH / 2, mousePos.yCord, PAWN_WIDTH, PAWN_HEIGHT);
                        else if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j].indexOf("rook") >= 0)
                            ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], mousePos.xCord + ROOK_WIDTH / 2, mousePos.yCord, ROOK_WIDTH, ROOK_HEIGHT);
                        else if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j].indexOf("knight") >= 0)
                            ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], mousePos.xCord + KNIGHT_WIDTH / 2, mousePos.yCord, KNIGHT_WIDTH, KNIGHT_HEIGHT);
                        else if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j].indexOf("bishop") >= 0)
                            ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], mousePos.xCord + BISHOP_WIDTH / 2, mousePos.yCord, BISHOP_WIDTH, BISHOP_HEIGHT);
                        else if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j].indexOf("king") >= 0)
                            ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], mousePos.xCord + KING_WIDTH / 2, mousePos.yCord, KING_WIDTH, KING_HEIGHT);
                        else if (board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j].indexOf("queen") >= 0)
                            ctx.drawImage(images[board[NUM_TILES_HEIGHT - 1 - i][NUM_TILES_WIDTH - 1 - j]], mousePos.xCord + QUEEN_WIDTH / 2, mousePos.yCord, QUEEN_WIDTH, QUEEN_HEIGHT);
                    }
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