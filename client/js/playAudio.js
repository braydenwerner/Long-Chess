import { getAudio } from "./assetLoader.js";

const AUDIO = getAudio();

const menuMusic = AUDIO["menu-music.mp3"].cloneNode();
export function playMenuMusic() {
    menuMusic.volume = ".4";
    menuMusic.play();
}

export function pauseMenuMusic() {
    menuMusic.pause();
}

export function gameStart() {
    const gameStart = AUDIO["game-start.mp3"].cloneNode();
    gameStart.volume = ".4";
    gameStart.play();
}

export function movePiece() {
    const moveSelf = AUDIO["move-self.mp3"].cloneNode();
    moveSelf.volume = ".4";
    moveSelf.play();
}

export function illegalMove() {
    const illegalMove = AUDIO["illegalMove.mp3"].cloneNode();
    illegalMove.volume = ".4";
    illegalMove.play();
}
