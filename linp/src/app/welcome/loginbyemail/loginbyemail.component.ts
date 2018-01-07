import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from "firebase";
import Persistence = firebase.auth.Auth.Persistence;
import {LocalStorage} from "../../services/angular2-local-storage";

@Component({
  selector: 'app-loginbyemail',
  templateUrl: './loginbyemail.component.html',
  styleUrls: ['./loginbyemail.component.css']
})
export class LoginbyemailComponent implements OnInit {

  @LocalStorage
  public localStorageEmail: string;

  public userProfileEmail: string;
  public userProfilePassword: string;

  constructor(//public activeModal: NgbActiveModal,
              public afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.userProfileEmail = this.localStorageEmail;
  }

  login(email, password) {
    this.localStorageEmail = email;
    // this.afAuth.auth.setPersistence(Persistence.SESSION)
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((response) => {

        }
        //  => this.activeModal.close()
      );
  }
}
