import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class SheetEffects {
  constructor(private actions$: Actions) {}
}
