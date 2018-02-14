"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
class DeleteGame {
    constructor() {
    }
    register() {
        return functions.https.onRequest((request, response) => {
            cors(request, response, () => {
                const gameRef = admin.firestore()
                    .collection('games')
                    .doc(request.query.gameName)
                    .delete()
                    .then(() => {
                    return response.status(200)
                        .send({ 'status': 'SUCCESS' });
                });
            });
        });
    }
}
exports.DeleteGame = DeleteGame;
