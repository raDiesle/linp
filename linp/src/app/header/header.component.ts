import { Location } from '@angular/common';
import { FirebaseGameService } from './../services/firebasegame.service';
import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { WindowRef } from '../WindowRef';
import { ActionguideService } from '../services/actionguide.service';
import { NgbPopover, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionguidemodalComponent } from '../widgets/actionguidemodal/actionguidemodal.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { GamerulesComponent } from '../gamerules/gamerules.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public showBackLink = false;
  public isDevelopmentEnv = false;
  public isMenuCollapsed = true;

  private lastVersion = 0;

  @Input() public gameName: string;
  @ViewChild('helpPopRef') public helpPop: NgbPopover;

  constructor(@Inject(WindowRef) private windowRef: WindowRef,
    private actionGuide: ActionguideService,
    private modalService: NgbModal,
    private firebaseGameService: FirebaseGameService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isDevelopmentEnv = this.windowRef.nativeWindow.location.host.includes('localhost');

    this.router.events.filter((event: any) => event instanceof NavigationEnd)
      .subscribe(event => {
        this.showBackLink = event.url.includes('/welcome') === false && event.url !== '/';
      });

    this.actionGuide.actionDone.subscribe(() => {
      this.helpPop.close();
      this.modalService.open(ActionguidemodalComponent);
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

  private gotHelpPopover() {
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

  public openHelp(): void {

    if (this.firebaseGameService.isLoggedIn()) {
      this.firebaseGameService.updatePlayerUiState({
        'uistates.showHelpPopover': false
      });
    } else {
      this.helpPop.close();
    }

    const modalRef = this.modalService.open(GamerulesComponent);
  }

}
