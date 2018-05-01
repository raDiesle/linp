const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Since this code will be running in the Cloud Functions enviornment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();


export class UserPresencestatus {

    constructor() {
    }

    public register() {
        // Create a new function which is triggered on changes to /status/{uid}
        // Note: This is a Realtime Database trigger, *not* Cloud Firestore.
        return functions.database
            .ref('/status/{uid}')
            .onUpdate(
                (change: any, context: any) => {
                    console.log('online', context.params.uid, change.after.val());
                    // Get the data written to Realtime Database
                    const eventStatus = change.after.val();

                    // Then use other event data to create a reference to the
                    // corresponding Firestore document.
                    const userStatusFirestoreRef = firestore.doc(`status/${context.params.uid}`);

                    // It is likely that the Realtime Database change that triggered
                    // this event has already been overwritten by a fast change in
                    // online / offline status, so we'll re-read the current data
                    // and compare the timestamps.
                    return change.after.ref.once('value').then((statusSnapshot: any) => {
                        const status = statusSnapshot.val();

                        // If the current timestamp for this data is newer than
                        // the data that triggered this event, we exit this function.
                        if (status.last_changed > eventStatus.last_changed) {
                            return null;
                        }

                        // Otherwise, we convert the last_changed field to a Date
                        eventStatus.last_changed = new Date(eventStatus.last_changed);

                        // ... and write it to Firestore.
                        return userStatusFirestoreRef.set(eventStatus);
                    });
                });

    }
}