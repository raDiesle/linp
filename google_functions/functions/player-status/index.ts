import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const listener = functions.database.ref('games/{gameName}/players/{uid}/status')
    .onWrite(async event => {
        // const original = event.data.val() as string;
        const gameName = (event.params as any).gameName;

        admin.database().ref('games/' + gameName + '/status')
            .set('new status');
    });