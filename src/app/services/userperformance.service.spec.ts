import { TestBed } from '@angular/core/testing';

import { UserperformanceService } from './userperformance.service';

describe('UserperformanceService', () => {
  let service: UserperformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserperformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
