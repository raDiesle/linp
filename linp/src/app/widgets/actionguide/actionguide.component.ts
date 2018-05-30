import {NavigationEnd, Router} from '@angular/router';
import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs/Subject';
import {GamePlayer} from "../../models/game";

@Component({
  selector: 'app-actionguide',
  templateUrl: './actionguide.component.html',
  styleUrls: ['./actionguide.component.scss']
})
export class ActionguideComponent implements OnInit, OnDestroy {

  @Input()
  public waitingGamePlayerNames: string[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() {
  }

  ngOnInit() {
 
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
