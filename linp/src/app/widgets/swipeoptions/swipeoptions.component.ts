import {Directive, ElementRef, Renderer2, Output, EventEmitter, Component, OnInit} from '@angular/core';

import { SwipeoptionsService } from './swipeoptions.service'
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[app-swipeoptions]',
 // templateUrl: './swipeoptions.component.html',
 // styleUrls: ['./swipeoptions.component.scss']
})
export class SwipeoptionsComponent implements OnInit {



  subscription: Subscription;
  deleteContainer: any;

  @Output() deleteCallback: EventEmitter<any> = new EventEmitter();
  @Output() addFriendCallback: EventEmitter<any> = new EventEmitter();


  constructor(private el: ElementRef, private renderer: Renderer2, private swipeoptionsService: SwipeoptionsService) {

  }

  ngOnInit() {
    this.renderer.setProperty(this.el.nativeElement, "uniqueId", this.swipeoptionsService.getNewId());

    this.renderer.addClass(this.el.nativeElement, "list-group-item");

    this.deleteContainer = this.renderer.createElement("div");
    this.renderer.addClass(this.deleteContainer, "bs4DeleteContainer");

    let deleteButton = this.renderer.createElement("button");
    this.renderer.addClass(deleteButton, "btn-delete");
    this.renderer.addClass(deleteButton, "btn");
    this.renderer.addClass(deleteButton, "btn-danger");
    this.renderer.setAttribute(deleteButton, "type", "button");
    this.renderer.setProperty(deleteButton, "root", this);
    this.renderer.listen(deleteButton, "click", () => this.deleteCallback.emit());
    let deleteText = this.renderer.createText("Cancel");
    this.renderer.appendChild(deleteButton, deleteText);


    let addFriendButton = this.renderer.createElement("button");
    this.renderer.addClass(addFriendButton, "btn-delete");
    this.renderer.addClass(addFriendButton, "btn");
    this.renderer.addClass(addFriendButton, "btn-success");
    this.renderer.setAttribute(addFriendButton, "type", "button");
    this.renderer.setProperty(addFriendButton, "root", this);
    this.renderer.listen(addFriendButton, "click", () => this.addFriendCallback.emit());

    let addFriendText = this.renderer.createText("Add friend");
    this.renderer.appendChild(addFriendButton, addFriendText);

    this.renderer.setAttribute(this.deleteContainer, "style", "border: 1px solid #212529;");

    this.renderer.appendChild(this.deleteContainer, addFriendButton);
    this.renderer.appendChild(this.deleteContainer, deleteButton);




    this.renderer.appendChild(this.el.nativeElement, this.deleteContainer);

    this.renderer.listen(this.el.nativeElement, "swipeleft", () => {
      this.swipeoptionsService.emitMessageEvent(this.el.nativeElement.uniqueId);
      this.renderer.addClass(this.el.nativeElement, "bs4ItemEditMode");
      this.renderer.removeClass(this.el.nativeElement, "bs4ItemUneditMode");
      this.renderer.addClass(this.deleteContainer, "bs4DeleteEditMode");
      this.renderer.removeClass(this.deleteContainer, "bs4DeleteUneditMode");
    });

    this.renderer.listen(this.el.nativeElement, "tap", () => this.swipeoptionsService.emitMessageEvent(-1));

    this.subscription = this.swipeoptionsService.getEmitter()
      .subscribe(uniqueId => {
        if (this.el.nativeElement.uniqueId != uniqueId) {
          this.uneditItem();
        }
      });
  }

  uneditItem() {
    if (this.el.nativeElement.className.indexOf("bs4ItemEditMode") > -1) {
      this.renderer.addClass(this.el.nativeElement, "bs4ItemUneditMode");
      this.renderer.removeClass(this.el.nativeElement, "bs4ItemEditMode");
    }
    if (this.deleteContainer.className.indexOf("bs4DeleteEditMode") > -1) {
      this.renderer.addClass(this.deleteContainer, "bs4DeleteUneditMode");
      this.renderer.removeClass(this.deleteContainer, "bs4DeleteEditMode");
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
