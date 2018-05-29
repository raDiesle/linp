import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-secondtiprules',
  templateUrl: './secondtiprules.component.html',
  styleUrls: ['./secondtiprules.component.scss']
})
export class SecondtiprulesComponent implements OnInit {

  @Input() public showDetails;

  constructor() {
  }

  ngOnInit() {
  }

}
