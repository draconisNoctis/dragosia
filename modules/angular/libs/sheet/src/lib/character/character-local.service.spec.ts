import { TestBed } from '@angular/core/testing';

import { CharacterLocalService } from './character-local.service';

describe('CharacterLocalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CharacterLocalService = TestBed.get(CharacterLocalService);
    expect(service).toBeTruthy();
  });
});
