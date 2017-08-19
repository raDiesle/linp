import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as AddMessage from './add-message'
import * as UpCaseMessages from './upcase-messages'
import {Evaluate} from './evaluate/index';

admin.initializeApp(functions.config().firebase);

export const addMessage = AddMessage.listener;
export const makeUpperCase = UpCaseMessages.listener;
export const evaluate = new Evaluate().register();
