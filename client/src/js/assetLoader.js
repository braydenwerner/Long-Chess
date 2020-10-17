const IMAGES_FILES = [
    "bishopWhite.png",
    "blackBishop.png",
    "kingBlack.png",
    "kingWhite.png",
    "knightBlack.png",
    "knightWhite.png",
    "pawnBlack.png",
    "pawnWhite.png",
    "queenBack.png",
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
