import {inject, TestBed} from '@angular/core/testing';

import {ActionguideService} from './actionguide.service';

describe('ActionguideService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionguideService]
    });
  });

  it('should be created', inject([ActionguideService], (service: ActionguideService) => {
    expect(service).toBeTruthy();
  }));
});
