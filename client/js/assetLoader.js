const IMAGES_FILES = [
    "bishopWhite.png",
    "bishopBlack.png",
    "kingBlack.png",
    "kingWhite.png",
    "knightBlack.png",
    "knightWhite.png",
    "pawnBlack.png",
    "pawnWhite.png",
    "queenBlack.png",
    "queenWhite.png",
    "rookBlack.png",
    "rookWhite.png",
];

const images = {};
const downloadPromiseImage = Promise.all(IMAGES_FILES.map(downloadImage));

function downloadImage(imageName) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            images[imageName] = image;
            resolve();
        };

        image.src = `./Images/${imageName}`;
    });
}

export const downloadImages = () => downloadPromiseImage;
export const getImages = () => images;

const AUDIO_FILES = [
    "game-start.wav",
    "move-self.wav",
];

const audioObject = {};
const downloadPromiseAudio = Promise.all(AUDIO_FILES.map(downloadAudio));

function downloadAudio(audioName) {
    return new Promise((resolve) => {
        const audio = new Audio();
        audioObject[audioName] = audio;
        audio.src = `./audio/${audioName}`;
        resolve();
    });
}

export const downloadAudios = () => downloadPromiseAudio;
export const getAudio = () => audioObject;
