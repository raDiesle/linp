import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-evaluationrules',
  templateUrl: './evaluationrules.component.html',
  styleUrls: ['./evaluationrules.component.scss']
})
export class EvaluationrulesComponent implements OnInit {

  @Input() public showDetails;

  constructor() { }

  ngOnInit() {
  }

}
