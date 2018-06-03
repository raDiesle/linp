import {FirebaseGameService} from './../services/firebasegame.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  // attach the fade in animation to the host (root) element of this component
})
export class WelcomeComponent implements OnInit, OnDestroy {

  public isLoggedIn: boolean = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit(): void {
    this.firebaseGameService.observeAuthUser()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.isLoggedIn = authUser !== null && authUser !== undefined;
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}


