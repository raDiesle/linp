import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireAuth} from 'angularfire2/auth';

@Component({
  selector: 'app-loginbyemail',
  templateUrl: './loginbyemail.component.html',
  styleUrls: ['./loginbyemail.component.css']
})
export class LoginbyemailComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
              public afAuth: AngularFireAuth) {
  }

  ngOnInit() {
  }

  login(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((response) => this.activeModal.close());

  }

}
