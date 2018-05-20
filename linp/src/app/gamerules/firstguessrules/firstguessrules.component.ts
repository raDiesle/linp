import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-firstguessrules',
  templateUrl: './firstguessrules.component.html',
  styleUrls: ['./firstguessrules.component.scss']
})
export class FirstguessrulesComponent implements OnInit {


  @Input() public showDetails;

  constructor() { }

  ngOnInit() {
  }

}
