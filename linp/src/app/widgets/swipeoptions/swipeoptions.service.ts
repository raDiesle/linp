import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class SwipeoptionsService {

  dispatcher: EventEmitter<any> = new EventEmitter();
  private _newId = -1;

  constructor() {
  }

  getNewId() {
    this._newId++;
    return this._newId;
  }

  emitMessageEvent(id: number) {
    this.dispatcher.emit(id);
  }

  getEmitter() {
    return this.dispatcher;
  }

}
