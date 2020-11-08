import { getAudio } from "./assetLoader.js";

const AUDIO = getAudio();

const menuMusic = AUDIO["menu-music.wav"].cloneNode();
export function playMenuMusic() {
    menuMusic.volume = ".4";
    menuMusic.play();
}

export function pauseMenuMusic() {
    menuMusic.pause();
}

export function gameStart() {
    const gameStart = AUDIO["game-start.wav"].cloneNode();
    gameStart.volume = ".4";
    gameStart.play();
}

export function movePiece() {
    const moveSelf = AUDIO["move-self.wav"].cloneNode();
    moveSelf.volume = ".4";
    moveSelf.play();
}

export function illegalMove() {
    const illegalMove = AUDIO["illegalMove.wav"].cloneNode();
    illegalMove.volume = ".4";
    illegalMove.play();
}
