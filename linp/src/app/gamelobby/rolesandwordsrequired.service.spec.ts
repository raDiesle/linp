import { TestBed, inject } from '@angular/core/testing';

import { RolesandwordsrequiredService } from './rolesandwordsrequired.service';

describe('RolesandwordsrequiredService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RolesandwordsrequiredService]
    });
  });

  it('should be created', inject([RolesandwordsrequiredService], (service: RolesandwordsrequiredService) => {
    expect(service).toBeTruthy();
  }));
});
