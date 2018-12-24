import { Action } from '@ngrx/store';

export enum SheetActionTypes {
  SetTheme = '[Sheet] Set Theme'
}

export class SetThemeAction implements Action {
  readonly type = SheetActionTypes.SetTheme;
  readonly payload : { theme: string };
  
  constructor(theme: string) {
      this.payload = { theme };
  }
}

export type SheetActions = SetThemeAction;
