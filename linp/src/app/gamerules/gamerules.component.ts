import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gamerules',
  templateUrl: './gamerules.component.html',
  styleUrls: ['./gamerules.component.css']
})
export class GamerulesComponent implements OnInit {

  public showDetails = false;
  public currentRulePosition: number;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.currentRulePosition = 0;
  }

}
