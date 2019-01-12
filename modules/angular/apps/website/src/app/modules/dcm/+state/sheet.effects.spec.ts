import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SheetEffects } from './sheet.effects';

describe('SheetEffects', () => {
  let actions$: Observable<any>;
  let effects: SheetEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SheetEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(SheetEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
