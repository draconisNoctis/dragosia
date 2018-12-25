import { createEntityAdapter, EntityState } from '@ngrx/entity'
import { SheetActions, SheetActionTypes } from './sheet.actions';

export interface ICharacterAbout {
    name: string;
    race: string;
    culture: string;
    class: string;
    description: string;
}

export interface ICharacterAttributes {
    strength: number;
    agility: number;
    dexterity: number;
    constitution: number;
    courage: number;
    intelligence: number;
    intuition: number;
    charisma: number;
}

export interface ICharacterSkills {
    melee: number;
    range: number;
    physical: number;
    mental: number;
}

export interface IGift {
    name: string;
    value: number;
}

export interface ITalent {
    name: string;
    skill: string;
    attribute: string;
    value: number;
}

export interface ICharacterTalents {
    melee: ITalent[];
    range: ITalent[];
    physical: ITalent[];
    mental: ITalent[];
    gifts: ITalent[];
}

export interface IMeleeWeapon {
    name: string;
    type: string;
    attribute: string;
    attackModification: number;
    paradeModification: number;
    damageModification: number;
}

export interface IRangeWeapon {
    name: string;
    type: string;
    attribute: string;
    range: string;
    attackModification: string;
    damageModification: string;
}

export interface ICharacter {
    _id: string;
    _changed?: boolean;
    
    about: ICharacterAbout;
    attributes: ICharacterAttributes;
    skills: ICharacterSkills;
    gifts: IGift[];
    advantages: string;
    disadvantages: string;
    health: number;
    mana: number;
    
    talents: ICharacterTalents;
    
    inventory: string;
    financials: string;
    equipment: string;
    
    melee: IMeleeWeapon[];
    range: IRangeWeapon[];
}

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
