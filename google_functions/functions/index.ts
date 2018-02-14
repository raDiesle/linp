import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {PlayerStatusTrigger} from './player-status';
import {GameStatusTrigger} from './game-status';

admin.initializeApp(functions.config().firebase);

export const playerStatusTrigger = new PlayerStatusTrigger().register();
export const gameStatusTrigger = new GameStatusTrigger().register();
