import { TestBed, inject } from '@angular/core/testing';

import { WordRoleAssignmentService } from './word-role-assignment.service';

describe('WordRoleAssignmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordRoleAssignmentService]
    });
  });

  it('should be created', inject([WordRoleAssignmentService], (service: WordRoleAssignmentService) => {
    expect(service).toBeTruthy();
  }));
});
