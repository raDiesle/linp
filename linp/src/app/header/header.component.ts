import {FirebaseGameService} from './../services/firebasegame.service';
import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {WindowRef} from '../WindowRef';
import {NgbModal, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {NavigationEnd, Router, ActivatedRoute} from '@angular/router';
import {GamerulesComponent} from '../gamerules/gamerules.component';
import { GameStatus } from 'app/models/game';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public showBackLink = null;
  public isDevelopmentEnv = false;
  public isMenuCollapsed = true;

  @Input()
  public gameName: string;

  @ViewChild('helpPopRef')
  public helpPop: NgbPopover;

  private lastVersion = 0;

  constructor(@Inject(WindowRef) private windowRef: WindowRef,
              private modalService: NgbModal,
              private firebaseGameService: FirebaseGameService,
              private router: Router,
              private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
 
 
 //   this.gameName = this.route.snapshot.paramMap.get('gamename') as GameStatus;
    
    this.isDevelopmentEnv = this.windowRef.nativeWindow.location.host.includes('localhost')
          || this.windowRef.nativeWindow.location.host.includes('192.168');

    this.router.events.filter((event: any) => event instanceof NavigationEnd)
      .subscribe(event => {
        this.showBackLink = event.url.includes('/welcome') === false && event.url !== '/';
      });

    this.firebaseGameService.fetchNewHtmlVersionStatus()
      .subscribe(currentVersion => {
        const isVersionToBeChecked = this.lastVersion !== 0;
        const isReloadApp = this.lastVersion !== currentVersion.val;
        if (isVersionToBeChecked && isReloadApp) {
          this.windowRef.nativeWindow.location.reload(true);
        }
        this.lastVersion = currentVersion.val;
      });

    this.firebaseGameService.observeLoggedInPlayerProfile()
      .subscribe(gameProfile => {
        const isTemporalFixForNoDbState = this.firebaseGameService.isLoggedIn() && gameProfile.uistates !== undefined;
        if (this.firebaseGameService.isLoggedIn() && isTemporalFixForNoDbState) {
          if (gameProfile.uistates.showHelpPopover === true) {
            setTimeout(() => {
              this.helpPop.open();
            }, 0);
          } else {
            this.helpPop.close();
          }
        }
      });
  }

  public openHelp(): void {
    if (this.firebaseGameService.isLoggedIn()) {
      this.firebaseGameService.updatePlayerUiState({
        'uistates.showHelpPopover': false
      });
    } else {
      this.helpPop.close();
    }

    this.modalService.open(GamerulesComponent);
  }

  public gotHelpPopover() {
    // TODO store in firestore gameProfile to never show popover again

    this.openHelp();
    if (this.firebaseGameService.isLoggedIn()) {
      this.firebaseGameService.updatePlayerUiState({
        'uistates.showHelpPopover': false
      });
    } else {
      this.helpPop.close();
    }
  }

}
