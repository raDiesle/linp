import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {Evaluate} from './evaluate/index';
import {WordRoleAssigment} from './word-role-assignment/index';

admin.initializeApp(functions.config().firebase);

export const evaluate = new Evaluate().register();
export const wordRoleAssignment = new WordRoleAssigment().register();
