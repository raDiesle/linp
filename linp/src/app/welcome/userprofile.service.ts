import { Injectable } from '@angular/core';

@Injectable()
export class UserprofileService {

  constructor() { }

  extractFirstName(displayName: string): string {
    // TODO use inside of html only TODO use random marvel name
    const randomSuggestedName = 'Bugs_Bunny';
    displayName = displayName ? displayName : randomSuggestedName;

    const firstLastName = displayName.split(' ');
    // TODO use inside of html only
    return (firstLastName.length > 0) ? firstLastName[0] : displayName;
  }
}
