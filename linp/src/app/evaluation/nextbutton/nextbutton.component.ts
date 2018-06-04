import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { GamePlayerStatus, GameStatus } from 'app/models/game';
import { HttpClient } from '@angular/common/http';
import { FirebaseGameService } from '../../services/firebasegame.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-nextbutton',
  templateUrl: './nextbutton.component.html',
  styleUrls: ['./nextbutton.component.scss']
})
export class NextbuttonComponent implements OnInit, OnDestroy {

  gameName: string;

  @Input()
  gameRound: number;

  @Input()
  private loggedInPlayerCurrentStatus: GamePlayerStatus;

  readonly NEXT_STATUS: GameStatus = 'finalizeround';
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
    private router: Router,
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    private httpClient: HttpClient,
    private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');
  }

  navigateToFinalizeRound() {
    let promise = Promise.resolve();
    if (this.loggedInPlayerCurrentStatus === 'SECOND_GUESS_GIVEN') {
      promise = this.firebaseGameService.updateGamePlayerStatus(
        this.firebaseGameService.authUserUid,
        this.gameName,
        'CHECKED_EVALUATION');
        this.ngOnDestroy();
    }
    promise.then(() => {
      this.router.navigate([this.NEXT_STATUS, this.gameName], { skipLocationChange: true });
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
