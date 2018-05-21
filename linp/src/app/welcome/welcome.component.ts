import { FirebaseGameService } from './../services/firebasegame.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  // attach the fade in animation to the host (root) element of this component
})
export class WelcomeComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public isLoggedIn = false;

  constructor(private firebaseGameService: FirebaseGameService) {

  }

  ngOnInit(): void {

    this.firebaseGameService.observeAuthUser()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.isLoggedIn = authUser !== null && authUser !== undefined;
      });

  }

}


