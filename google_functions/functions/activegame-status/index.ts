import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Game, GamePlayer, GamePlayerStatus, GameStatus} from '../../../linp/src/app/models/game';
import * as nodemailer from 'nodemailer';


// https://github.com/firebase/functions-samples/tree/master/quickstarts/email-users

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});


// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Cloud Storage for Firebase quickstart';

export class ActiveGameStatusTrigger {

    constructor() {
    }

    public register() {
        return functions.firestore
            .document('players/{uid}/activegames/{gameName}')
            .onUpdate(event => {
                console.log('activegame-function');
                return Promise.resolve(); 
            });
    }

    private sendMail(): Promise<any>{
        const mailOptions: any = {
            from: `${APP_NAME} <amend6@gmail.com>`,
            to: 'david.amend@it-amend.de',
          };
        
          // The user subscribed to the newsletter.
          mailOptions.subject = `Welcome to test!`;
          mailOptions.text = `Hey Test`;
          return mailTransport.sendMail(mailOptions).then(() => {
            return console.log('New welcome email sent to:', 'david.amend@it-amend.de');
          });
    }
}