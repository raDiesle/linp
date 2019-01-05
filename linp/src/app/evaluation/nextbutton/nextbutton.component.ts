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

  public gameName: string;

  public isFirstTimeVisitingPage: boolean = null;

  @Input()
  gameRound: number;

  @Input()
  private loggedInPlayerCurrentStatus: GamePlayerStatus;

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
    this.isFirstTimeVisitingPage = this.loggedInPlayerCurrentStatus === 'SECOND_GUESS_GIVEN';
  }

  public navigateToFinalizeRound() {
    let promise = Promise.resolve();
    if (this.isFirstTimeVisitingPage) {
      promise = this.firebaseGameService.updateGamePlayerStatus(
        this.firebaseGameService.authUserUid,
        this.gameName,
        'CHECKED_EVALUATION');
      this.ngOnDestroy();
    }
    promise.then(() => {
      const NEXT_STATUS: GameStatus = 'finalizeround';
      this.router.navigate([NEXT_STATUS, this.gameName], { skipLocationChange: true });
    });
  }

  public continueGame() {
    const nextNextPage: GameStatus = 'firsttip';
    this.router.navigate([nextNextPage, this.gameName], { skipLocationChange: true });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
