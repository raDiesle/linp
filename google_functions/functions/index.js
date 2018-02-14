"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const player_status_1 = require("./player-status");
const game_status_1 = require("./game-status");
admin.initializeApp(functions.config().firebase);
exports.playerStatusTrigger = new player_status_1.PlayerStatusTrigger().register();
exports.gameStatusTrigger = new game_status_1.GameStatusTrigger().register();
