import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {FirebaseGameService} from './firebasegame.service';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  private firebasegameService: FirebaseGameService;

  constructor(injector: Injector) {
    setTimeout(() => this.firebasegameService = injector.get(FirebaseGameService));
  }

  handleError(error) {
    console.error(error);
    if (<any>window.location.host.includes('localhost') === false) {
      this.firebasegameService.logToServer(error);
    }
  }
}
