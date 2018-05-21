import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GameStatus } from '../models/game';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-gamerules',
  templateUrl: './gamerules.component.html',
  styleUrls: ['./gamerules.component.css']
})
export class GamerulesComponent implements OnInit, OnDestroy {
  readonly currentGameStatusConfig: any[] = [
    {
      status: 'welcome',
      rulepos: 0,
      gameprogress: {
        parent: 0,
        child: 0
      }
    },
    {
      status: 'gamelobby',
      rulepos: 0,
      gameprogress: {
        parent: 0,
        child: 0
      }
    },
    {
      status: 'firsttip',
      rulepos: 0,
      gameprogress: {
        parent: 1,
        child: 1
      }
    },
    {
      status: 'firstguess',
      rulepos: 0,
      gameprogress: {
        parent: 1,
        child: 2
      }
    },
    {
      status: 'secondtip',
      rulepos: 0,
      gameprogress: {
        parent: 2,
        child: 3
      }
    },
    {
      status: 'secondguess',
      rulepos: 0,
      gameprogress: {
        parent: 2,
        child: 4
      }
    },
    {
      status: 'evaluation',
      rulepos: 0,
      gameprogress: {
        parent: 3,
        child: 5
      }
    }
  ];

  public currentGameStatusPositions: any = this.currentGameStatusConfig.find(
    c => c.status === 'welcome'
  );
  public showDetails = false;
  public currentRulePosition: number;
  private isSwitchingPageIndicator = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit() {
    this.currentRulePosition = 0;

    this.router.events
      .filter((event: any) => event instanceof NavigationEnd)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(event => {
        if (this.isSwitchingPageIndicator) {
          this.activeModal.close();
        }
        this.isSwitchingPageIndicator = true;

        const currentGameStatus: GameStatus = event.url.replace(/^\/+/g, '');
        this.currentGameStatusPositions = this.currentGameStatusConfig.find(
          c => c.status === currentGameStatus
        );
        this.currentRulePosition = this.currentGameStatusConfig.findIndex((c) => c === this.currentGameStatusPositions);
      });
  }

  public prevRulesPos() {
    this.switchRulesPos(-1);
  }

  public nextRulesPos() {
    this.switchRulesPos(1);
  }

  private switchRulesPos(offset: number) {
    const currentIndex = this.currentGameStatusConfig.findIndex((c) => c === this.currentGameStatusPositions);
    const newAbsoluteIndex = (currentIndex + offset);
    const rangedIndex = newAbsoluteIndex % this.currentGameStatusConfig.length;
    const lastElementIndex = (this.currentGameStatusConfig.length - 1);
    const newIndex = newAbsoluteIndex === -1 ? lastElementIndex : rangedIndex;
    this.currentRulePosition = newIndex;
    this.currentGameStatusPositions = this.currentGameStatusConfig[newIndex];
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
