import { Component, OnInit, Input, Inject } from '@angular/core';
import { WindowRef } from '../WindowRef';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isDevelopmentEnv = false;
  public isMenuCollapsed = true;

  @Input() public gameName: string;

  constructor(@Inject(WindowRef) private windowRef: WindowRef) { }

  ngOnInit() {
    this.isDevelopmentEnv = this.windowRef.nativeWindow.location.host.includes('localhost');
  }

}
