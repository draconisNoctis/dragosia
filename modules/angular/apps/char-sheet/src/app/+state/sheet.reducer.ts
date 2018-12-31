import { ICharacter } from '@jina-draicana/presets';
import { createEntityAdapter, EntityState } from '@ngrx/entity'
import { SheetActions, SheetActionTypes } from './sheet.actions';


export interface SheetState {
    sheet: SheetData
}

export interface SheetData extends EntityState<ICharacter> {
    theme : string;
}

const sheetAdapter = createEntityAdapter<ICharacter>({
    selectId: e => e._id
});

export const initialState : SheetData = sheetAdapter.getInitialState({
    theme: 'standard'
});


export function sheetReducer(state = initialState, action : SheetActions) : SheetData {
    switch(action.type) {
        case SheetActionTypes.SetTheme:
            return { ...state, ...action.payload };
        case SheetActionTypes.RestoreAll:
            return sheetAdapter.addMany(action.payload.characters, state);
        case SheetActionTypes.Update:
            return sheetAdapter.upsertOne({ ...action.payload.character, _changed: true }, state);
        case SheetActionTypes.Store:
            return sheetAdapter.upsertOne({ ...action.payload.character, _changed: undefined }, state);
        default:
            return state;
    }
}

const { selectAll } = sheetAdapter.getSelectors<SheetState>(s => s.sheet);

export { selectAll as selectAllSheets }
