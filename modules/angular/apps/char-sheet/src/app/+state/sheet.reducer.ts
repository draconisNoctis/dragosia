import { SheetActions, SheetActionTypes } from './sheet.actions';

export interface SheetState {
    sheet: SheetData
}

export interface SheetData {
    theme : string;
}

export const initialState : SheetData = {
    theme: 'standard'
};

export function sheetReducer(state = initialState, action : SheetActions) : SheetData {
    switch(action.type) {
        case SheetActionTypes.SetTheme:
            return { ...state, ...action.payload };
        
        default:
            return state;
    }
}
