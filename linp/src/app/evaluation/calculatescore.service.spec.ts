import { TestBed, inject } from '@angular/core/testing';

import { CalculatescoreService } from './calculatescore.service';

describe('CalculatescoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalculatescoreService]
    });
  });

  it('should be created', inject([CalculatescoreService], (service: CalculatescoreService) => {
    expect(service).toBeTruthy();
  }));
});
