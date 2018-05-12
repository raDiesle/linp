import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { WindowRef } from '../WindowRef';
import { ActionguideService } from '../services/actionguide.service';
import { NgbPopover, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionguidemodalComponent } from '../widgets/actionguidemodal/actionguidemodal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isDevelopmentEnv = false;
  public isMenuCollapsed = true;

  @Input() public gameName: string;
  @ViewChild('nextActionGuide') public nextActionGuide: NgbPopover;

  constructor(@Inject(WindowRef) private windowRef: WindowRef,
  private actionGuide: ActionguideService,
  private modalService: NgbModal,
 // private actionguidemodalComponent: ActionguidemodalComponent
) { }

  ngOnInit() {
    this.isDevelopmentEnv = this.windowRef.nativeWindow.location.host.includes('localhost');
    this.actionGuide.actionDone.subscribe(() => {
      this.modalService.open(ActionguidemodalComponent);
    });
  }

  

}
