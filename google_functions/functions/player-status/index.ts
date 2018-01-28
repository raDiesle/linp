import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export class PlayerStatusTrigger {
    constructor() {

    }

    public register() {
        return functions.firestore
            .document('games/{gameName}/players/{uid}')
            .onUpdate(event => {

                const gameName = (event.params as any).gameName;
                const playerStatus = (event.params as any).status;

                if (playerStatus === 'FIRST_GUESS_GIVEN') {

                }

                // 'games/' + gameName + '/status'

                // Get an object representing the document
                // e.g. {'name': 'Marie', 'age': 66}
                const newValue = event.data.data();

                // ...or the previous value before this update
                const previousValue = event.data.previous.data();

                // access a particular field as you would any JS property
                const name = newValue.name;

                console.log(newValue);
                console.log(gameName);
                console.log(playerStatus);
                // perform desired operations ...
            });
    }
}
