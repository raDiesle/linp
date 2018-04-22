import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Game, GamePlayer, GamePlayerStatus, GameStatus} from '../../../linp/src/app/models/game';
import * as nodemailer from 'nodemailer';

// https://github.com/firebase/functions-samples/tree/master/quickstarts/email-users

var transporter = nodemailer.createTransport({
    service: 'gmail',
    
    auth: {
           user: functions.config().gmail.email,
           pass: functions.config().gmail.password
       }
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
            .onUpdate((change, context) => {
                const uid: string = context.params.uid;
                const gameName: string = context.params.gameName;

                const isTestUser = gameName.startsWith('test');
                if(isTestUser || change.after.data().isActionRequired === true && change.before.data().isActionRequired === false){
                    return Promise.resolve();
                }
                            
                return admin.firestore()
                    .doc('/status/' + uid)
                    .get()
                    .then((doc) => {
                        
                        const isOnline = doc.data().state === 'online';
                        // const link = // 'http://www.adventurio.de/' + 'gamelobby/' + gameName                
                        if(isOnline){
                            return Promise.resolve();
                        }
                        return admin.auth()
                            .getUser(uid)
                            .then(user => {
                                return this.sendMail(user.email, gameName);
                        });
                }); 
            });
    }

// Authorize a client with the loaded c
    
    private sendMail(receiver: string, gameName: string): Promise<any>{
        const mailOptions: any = {
            from: `LINP <LINP Game>`,
            to: receiver,
          };
        
          // The user subscribed to the newsletter.
          mailOptions.subject = gameName + `: your turn!`;
        const messageBody = "http://www.adventurio.de/gamelobby/" + gameName;
          mailOptions.text = `It is your turn on ` + encodeURI(messageBody);
          // '<a href="http://www.adventurio.de/' + 'gamelobby/' + gameName + '">'+ gameName+ '</a>'
          return transporter.sendMail(mailOptions)
            .then(() => {
                console.log('email sent to:', receiver);
                return Promise.resolve();
          })
          .catch(e => {
              console.error(e);
              return Promise.resolve();
          });
    }

    private verifyConnection(){
        // verify connection configuration
        transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take our messages');
            }
        });
    }
    
}