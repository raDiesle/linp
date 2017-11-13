import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {Game, GamePlayer, GameStatus, TeamTip} from '../../models/game';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {GuessService} from '../guess.service';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-secondguess',
  templateUrl: './secondguess.component.html',
  styleUrls: ['./secondguess.component.css']
})
export class SecondguessComponent implements OnInit, OnDestroy {

  authUser: firebase.User;
  gameName: string;

  selectedGamePlayers: GamePlayer[] = [];
  gamePlayers: GamePlayer[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFirestore,
              public afAuth: AngularFireAuth,
              public guessService: GuessService) {

    afAuth.authState.subscribe(authUser => {
      this.authUser = authUser;
    });
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');
    this.db.doc<Game>('/games/' + this.gameName)
      .valueChanges()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((game: Game) => {
        this.gamePlayers = game.players;

        this.observeGamePlayerStatus(game.players, game.host);
      });
  }

  onTeamPlayerGuessSelected(clickedGamePlayer): void {
    //  TODO make it non modifyable with rxjs, { ...this.selectedGamePlayers}
    this.selectedGamePlayers = this.guessService.onTeamPlayerGuessSelected(this.selectedGamePlayers, clickedGamePlayer);
  }

  savesecondTeamTip(): void {
    const createGuessModel = function (selectedGamePlayers) {
      const firstTeamTip: TeamTip = {
        firstPartner: {
          uid: selectedGamePlayers[0].uid,
          name: selectedGamePlayers[0].name
        },
        secondPartner: {
          uid: selectedGamePlayers[1].uid,
          name: selectedGamePlayers[0]
        }
      };
      return secondTeamTip;
    };
// move to model
    const secondTeamTip = createGuessModel(this.selectedGamePlayers);
    const tipDBkey = '/secondTeamTip';
    this.db.doc<TeamTip>('games/' + this.gameName + '/players/' + this.authUser.uid + tipDBkey)
      .set(secondTeamTip)
      .then(secondTeamTipz => {
        alert('Successful saved choice');
      });
  }

  private observeGamePlayerStatus(gamePlayers: GamePlayer[], hostUid: string) {
    const nextPositiveRoute = '/evaluation';
    const statusToCheck: GameStatus = 'SECOND_WORD_GIVEN';
    const observingPlayerStatus = Observable.pairs(gamePlayers)
      .flatMap(p => Observable.of(p))
      .every(keyValueGamePlayers => {
        return keyValueGamePlayers[1]['status'] === statusToCheck;
      })
      .toPromise()
      .then(allGivenFirstSynonym => {
        if (!allGivenFirstSynonym) {
          return;
        }

        this.router.navigate([nextPositiveRoute, this.gameName]);
      });
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
