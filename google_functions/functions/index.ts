import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {PlayerStatusTrigger} from './player-status';
import {GameStatusTrigger} from './game-status';
import { ActiveGameStatusTrigger } from './activegame-status';

admin.initializeApp(functions.config().firebase);
import { UserPresencestatus } from './userpresencestatus';

export const playerStatusTrigger = new PlayerStatusTrigger().register();
export const gameStatusTrigger = new GameStatusTrigger().register();
export const activegameStatusTrigger = new ActiveGameStatusTrigger().register();
export const userpresencestatus = new UserPresencestatus().register();