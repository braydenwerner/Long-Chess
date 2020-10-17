const RENDER_DELAY = 100;

const gameUpdates = [];
let gameStart = 0;
let firstServerTimestamp = 0;

export function initState() {
    gameStart = 0;
    firstServerTimestamp = 0;
}

//Add new update, remove old updates.
export function processGameUpdate(update) {
    if (!firstServerTimestamp) {
        firstServerTimestamp = update.t;
        gameStart = Date.now();
    }
    gameUpdates.push(update);

    // Keep only one game update before the current server time
    const base = getBaseUpdate();
    if (base > 0) {
        gameUpdates.splice(0, base);
    }
}

function currentServerTime() {
    return firstServerTimestamp + (Date.now() - gameStart) - RENDER_DELAY;
}

// Returns the index of the base update, the first game update before
// current server time, or -1 if N/A.
function getBaseUpdate() {
    const serverTime = currentServerTime();
    for (let i = gameUpdates.length - 1; i >= 0; i--) {
        if (gameUpdates[i].t <= serverTime) {
            return i;
        }
    }
    return -1;
}

export function getCurrentState() {
    if (!firstServerTimestamp) {
        return {};
    }

    return gameUpdates[gameUpdates.length - 1];
}
