import { TestBed, inject } from '@angular/core/testing';

import { GuessService } from './guess.service';

describe('GuessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuessService]
    });
  });

  it('should be created', inject([GuessService], (service: GuessService) => {
    expect(service).toBeTruthy();
  }));
});
