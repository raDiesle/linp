import {FirebaseGameService} from './../services/firebasegame.service';
import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {WindowRef} from '../WindowRef';
import {ActionguideService} from '../services/actionguide.service';
import {NgbModal, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {ActionguidemodalComponent} from '../widgets/actionguidemodal/actionguidemodal.component';
import {NavigationEnd, Router} from '@angular/router';
import {GamerulesComponent} from '../gamerules/gamerules.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public showBackLink = false;
  public isDevelopmentEnv = false;
  public isMenuCollapsed = true;
  @Input() public gameName: string;
  @ViewChild('helpPopRef') public helpPop: NgbPopover;
  private lastVersion = 0;

  constructor(@Inject(WindowRef) private windowRef: WindowRef,
              private actionGuide: ActionguideService,
              private modalService: NgbModal,
              private firebaseGameService: FirebaseGameService,
              private router: Router
  ) {
  }

  ngOnInit() {
    this.isDevelopmentEnv = this.windowRef.nativeWindow.location.host.includes('localhost');

    this.router.events.filter((event: any) => event instanceof NavigationEnd)
      .subscribe(event => {
        this.showBackLink = event.url.includes('/welcome') === false && event.url !== '/';
      });

    this.actionGuide.actionDone.subscribe((gamePlayers) => {
      this.helpPop.close();
      let actionGuideInstance = this.modalService.open(ActionguidemodalComponent, {centered: true, size: 'lg'});
      actionGuideInstance.componentInstance.gamePlayers = gamePlayers;
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
        } else {
          setTimeout(() => {
            this.helpPop.open();
          }, 0);
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
