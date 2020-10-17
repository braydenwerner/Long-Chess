import { getCurrentState } from "./gameUpdate.js";
import { NUM_TILES_WIDTH, NUM_TILES_HEIGHT } from "./constantClient.js";
import { getImages } from "./assetLoader.js";
import { socket } from "./networking.js";

const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");

const Images = getImages();

let tileSize;
let map;

initMapVars();
window.onresize = () => {
    initMapVars();
}

function initMapVars() {
    canvas.width = window.innerWidth - 2;
    canvas.height = window.innerHeight - 2;
    tileSize = (canvas.height - 2) / NUM_TILES_HEIGHT;
}

export function startRender() {
    setInterval(render, 1000 / 60);
}

function render() {
    //current socket = socket.id
    //check if current socket matches white
    //console.log(getCurrentState().room.white === socket.id);

    const { room } = getCurrentState();
    console.log(getCurrentState());

    renderBoard(room.board);
}

function renderBoard(board) {
    //board
    for (let i = 0; i < NUM_TILES_HEIGHT; i++) {
        for (let j = 0; j < NUM_TILES_WIDTH; j++) {

        }
    }

    //pieces
    console.log(board);
}
