import { handleInput } from "./networking.js";

function keypress(e) {
    handleInput(e);
}

export function startCaptureInput() {
    window.addEventListener("keydown", keypress);
}

export function stopCaptureInput() {
    window.removeEventListener("keydown", keypress);
}
