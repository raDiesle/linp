import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';
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
  gamePlayers: { [uid: string]: GamePlayer };
  gamePlayerKeys: string[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              private httpClient: HttpClient,
              public guessService: GuessService) {

    afAuth.authState.subscribe(response => {
      this.authUser = response;
    });
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');
    this.db.object('/games/' + this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((game: Game) => {
        this.gamePlayers = game.players;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);

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
    this.db.object('games/' + this.gameName + '/players/' + this.authUser.uid + tipDBkey)
      .set(secondTeamTip)
      .then(secondTeamTip => {
        alert('Successful saved choice');
      });
  }

  private observeGamePlayerStatus(gamePlayers: { [uid: string]: GamePlayer }, hostUid: string) {
    const nextPositiveRoute = '/evaluation';
    const statusToCheck: GameStatus = 'EVALUATE';
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

        // hack to not have cheap non serverside trigger
        const isOnlyExecutedOnHostBrowser = this.authUser.uid === hostUid;
        if (isOnlyExecutedOnHostBrowser) {
          const url = 'https://us-central1-linp-c679b.cloudfunctions.net/evaluate';
          // const headers = new Headers({'Authorization': 'Bearer ' + this.authUser.uid});
          this.httpClient
            .get(url,
              {
                // headers: headers,
                params: new HttpParams()
                  .set('status', statusToCheck)
                  .set('gameName', this.gameName)
              })
            .subscribe(response => console.log('calculated evaluation on serverside'));
        }

        this.router.navigate([nextPositiveRoute, this.gameName]);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
