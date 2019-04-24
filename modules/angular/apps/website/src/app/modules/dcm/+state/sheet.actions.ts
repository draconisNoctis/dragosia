import { ICharacter } from '@jina-draicana/presets';
import { Action } from '@ngrx/store';
import { CHARACTER_PROVIDER } from '../../../../../../../libs/sheet/src/lib/character.service';

export enum SheetActionTypes {
    SetTheme = '[Sheet] Set Theme',
    GetAll = '[Sheet] Get All',
    FetchAll = '[Sheet] Fetch All',

    FetchOne = '[Sheet] Fetch One',
    StoreAll = '[Sheet] Store All',

    Put = '[Sheet] Put',
    Update = '[Sheet] Update',

    Delete = '[Sheet] Delete',
    DoDelete = '[Sheet] Do Delete',

    Export = '[Sheet] Export',
    Import = '[Sheet] Import'
}

export class SetThemeAction implements Action {
    readonly type = SheetActionTypes.SetTheme;
    readonly payload : { theme : string };

    constructor(theme : string) {
        this.payload = { theme };
    }
}

export class PutAction implements Action {
    readonly type = SheetActionTypes.Put;
    readonly payload : { character: ICharacter };

    constructor(character : ICharacter) {
        this.payload = { character };
    }
}

export class StoreAllAction implements Action {
    readonly type = SheetActionTypes.StoreAll;
    readonly payload : { characters: ICharacter[] };

    constructor(characters : ICharacter[]) {
        this.payload = { characters };
    }
}

export class GetAllAction implements Action {
    readonly type = SheetActionTypes.GetAll;
}

export class FetchAllAction implements Action {
    readonly type = SheetActionTypes.FetchAll;
}

export class FetchOneAction implements Action {
    readonly type = SheetActionTypes.FetchOne;
    readonly payload : { id: string };

    constructor(id: string) {
        this.payload = { id };
    }
}

export class UpdateAction implements Action {
    readonly type = SheetActionTypes.Update;
    readonly payload : { character: ICharacter };

    constructor(character : ICharacter) {
        this.payload = { character };
    }
}

export class DeleteAction implements Action {
    readonly type = SheetActionTypes.Delete;
    readonly payload : { character: ICharacter };

    constructor(character : ICharacter) {
        this.payload = { character };
    }
}

export class DoDeleteAction implements Action {
    readonly type = SheetActionTypes.DoDelete;
    readonly payload : { character: ICharacter };

    constructor(character : ICharacter) {
        this.payload = { character };
    }
}

export class ExportAction implements Action {
    readonly type = SheetActionTypes.Export;
    readonly payload : { character: ICharacter };

    constructor(character : ICharacter) {
        this.payload = { character };
    }
}

export class ImportAction implements Action {
    readonly type = SheetActionTypes.Import;
    readonly payload : { data: Blob, provider : CHARACTER_PROVIDER };

    constructor(data : Blob, provider : CHARACTER_PROVIDER) {
        this.payload = { data, provider };
    }
}

export type SheetActions = SetThemeAction | PutAction | StoreAllAction | FetchOneAction | UpdateAction | DeleteAction | DoDeleteAction;
