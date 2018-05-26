import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-secondguessrules',
  templateUrl: './secondguessrules.component.html',
  styleUrls: ['./secondguessrules.component.scss']
})
export class SecondguessrulesComponent implements OnInit {

  @Input() public showDetails;

  constructor() {
  }

  ngOnInit() {
  }

}
