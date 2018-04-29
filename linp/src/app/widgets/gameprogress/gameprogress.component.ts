import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gameprogress',
  templateUrl: './gameprogress.component.html',
  styleUrls: ['./gameprogress.component.scss']
})
export class GameprogressComponent implements OnInit {

  @Input() public parent: number;
  @Input() public child: number;

  constructor() { }

  ngOnInit() {
  }

}
