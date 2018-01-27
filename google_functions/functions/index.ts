import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {Evaluate} from './evaluate/index';
import {WordRoleAssigment} from './word-role-assignment/index';
import {PlayerStatus, PlayerStatusTrigger} from "./player-status";

admin.initializeApp(functions.config().firebase);

export const evaluate = new Evaluate().register();
export const wordRoleAssignment = new WordRoleAssigment().register();
export const playerStatusTrigger = new PlayerStatusTrigger().register();