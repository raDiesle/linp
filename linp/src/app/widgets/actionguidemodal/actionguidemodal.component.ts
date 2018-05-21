import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-actionguidemodal',
  templateUrl: './actionguidemodal.component.html',
  styleUrls: ['./actionguidemodal.component.scss']
})
export class ActionguidemodalComponent implements OnInit {

  private isSwitchingPageIndicator = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public activeModal: NgbActiveModal,
    private router: Router) { }

  ngOnInit() {
    this.router.events
      .filter((event: any) => event instanceof NavigationEnd)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(event => {
        if (this.isSwitchingPageIndicator) {
          this.activeModal.close();
        }
        this.isSwitchingPageIndicator = true;
      });
  }

}
