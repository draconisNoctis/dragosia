import { TestBed } from '@angular/core/testing';

import { CharacterFirebaseService } from './character-firebase.service';

describe('CharacterFirebaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CharacterFirebaseService = TestBed.get(CharacterFirebaseService);
    expect(service).toBeTruthy();
  });
});
