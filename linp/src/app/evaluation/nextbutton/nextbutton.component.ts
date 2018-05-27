import {Component, Input, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {GamePlayerStatus, GameStatus} from 'app/models/game';
import {HttpClient} from '@angular/common/http';
import {FirebaseGameService} from '../../services/firebasegame.service';

@Component({
  selector: 'app-nextbutton',
  templateUrl: './nextbutton.component.html',
  styleUrls: ['./nextbutton.component.scss']
})
export class NextbuttonComponent implements OnInit {

  gameName: string;

  @Input()
  isRealCalculatedHack: boolean;

  @Input()
  gameRound: number;

  readonly NEXT_STATUS: GameStatus = 'finalizeround';
  readonly NEXT_PLAYER_STATUS: GamePlayerStatus = 'CHECKED_EVALUATION';

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
    this.firebaseGameService.updateGamePlayerStatus(
      this.firebaseGameService.authUserUid,
      this.gameName,
      this.NEXT_PLAYER_STATUS)
      .then(() => {
        this.router.navigate([this.NEXT_STATUS, this.gameName], {skipLocationChange: true});
      });
  }
}
