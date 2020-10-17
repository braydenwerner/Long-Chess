const Bishop = require("./bishop");
const King = require("./king");
const Knight = require("./knight");
const Pawn = require("./pawn");
const Queen = require("./queen");
const Rook = require("./rook");

const board =
    [[new Rook("black"), new Knight("black"), new Bishop("black"), new Queen("black"), new King("black"), new Bishop("black"), new Knight("Black"), new Rook("Black")],
    [new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black")],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    [new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white")],
    [new Rook("white"), new Knight("white"), new Bishop("white"), new Queen("white"), new King("white"), new Bishop("white"), new Knight("white"), new Rook("white")]]

module.exports = board;