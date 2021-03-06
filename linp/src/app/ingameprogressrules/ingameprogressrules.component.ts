import {PlayerRolesCounts} from './../models/game';
import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AngularFirestore} from 'angularfire2/firestore';
import {GamePlayer, GameStatus} from '../models/game';
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseGameService} from '../services/firebasegame.service';

@Component({
  selector: 'app-ingameprogressrules',
  templateUrl: './ingameprogressrules.component.html',
  styleUrls: ['./ingameprogressrules.component.scss']
})
export class IngameprogressrulesComponent implements OnInit {


  readonly NEXT_PAGE: GameStatus = 'firsttip';
  public isRoleAssigned = false;
  // TODO remove, deprecated and wrong

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private rolesDistributionInformation: PlayerRolesCounts;

  private isQuestionmark = false;
  private currentGamePlayersRoleWord: string;
  private gameName: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFirestore,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {

    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        this.router.navigate(['/' + game.status, this.gameName], {skipLocationChange: true});
        this.rolesDistributionInformation = game.playerRolesCounts;
        this.isRoleAssigned = this.rolesDistributionInformation !== null;
      });

    this.firebaseGameService.observeLoggedInGamePlayer(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      // .toPromise()
      .subscribe((currentGamePlayer: GamePlayer) => {
        this.isQuestionmark = currentGamePlayer.questionmarkOrWord === '?';
        this.currentGamePlayersRoleWord = currentGamePlayer.questionmarkOrWord;
      });
  }

}
