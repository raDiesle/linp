import {inject, TestBed} from '@angular/core/testing';

import {GuessService} from './guess.service';

describe('LinpCardsModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuessService]
    });
  });

  it('should be created', inject([GuessService], (service: GuessService) => {
    expect(service).toBeTruthy();
  }));
});
