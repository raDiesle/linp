import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gamelobbyrules',
  templateUrl: './gamelobbyrules.component.html',
  styleUrls: ['./gamelobbyrules.component.scss']
})
export class GamelobbyrulesComponent implements OnInit {

  @Input() public showDetails;
  constructor() { }

  ngOnInit() {
  }

}
