import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ActionguideService {
  public actionDone: EventEmitter<void>;
  constructor() { 
    this.actionDone = new EventEmitter();
  }

  public triggerActionDone(){
    this.actionDone.emit();
  }
}
