import { getAudio } from "./assetLoader.js";

const AUDIO = getAudio();

export function gameStart() {
    let gameStart = AUDIO["game-start.wav"].cloneNode();
    gameStart.volume = ".4";
    gameStart.play();
}

export function movePiece() {
    let moveSelf = AUDIO["move-piece.wav"].cloneNode();
    moveSelf.volume = ".4";
    moveSelf.play();
}
