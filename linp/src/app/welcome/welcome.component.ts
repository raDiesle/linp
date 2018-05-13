import { FirebaseGameService } from './../services/firebasegame.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  // attach the fade in animation to the host (root) element of this component
})
export class WelcomeComponent implements OnInit{

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public authUser: firebase.User;

  constructor(firebaseGameService: FirebaseGameService) {
    firebaseGameService.observeAuthUser()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;
      });
  }
  
  ngOnInit(): void {
    
  }

}


