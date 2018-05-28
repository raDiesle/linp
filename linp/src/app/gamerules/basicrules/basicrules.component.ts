import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-basicrules',
  templateUrl: './basicrules.component.html',
  styleUrls: ['./basicrules.component.scss']
})
export class BasicrulesComponent implements OnInit {

  @Input() public showDetails;

  constructor() {
  }

  ngOnInit() {
  }

}
