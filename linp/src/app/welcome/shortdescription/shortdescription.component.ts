import { Component, OnInit } from '@angular/core';
import { FirebaseGameService } from '../../services/firebasegame.service';

@Component({
  selector: 'app-shortdescription',
  templateUrl: './shortdescription.component.html',
  styleUrls: ['./shortdescription.component.scss']
})
export class ShortdescriptionComponent implements OnInit {

  public showShortDescription = false;

  constructor() { }

  ngOnInit() {
  }

}
