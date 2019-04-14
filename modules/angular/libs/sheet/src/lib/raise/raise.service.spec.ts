import { TestBed } from '@angular/core/testing';

import { RaiseService } from './raise.service';

describe('RaiseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RaiseService = TestBed.get(RaiseService);
    expect(service).toBeTruthy();
  });
});
