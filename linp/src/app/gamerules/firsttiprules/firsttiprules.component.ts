import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-firsttiprules',
  templateUrl: './firsttiprules.component.html',
  styleUrls: ['./firsttiprules.component.scss']
})
export class FirsttiprulesComponent implements OnInit {

  @Input() public showDetails;

  constructor() { }

  ngOnInit() {
  }

}
