import { ICharacter } from '@jina-draicana/presets';
import { Action } from '@ngrx/store';

export enum SheetActionTypes {
    SetTheme = '[Sheet] Set Theme',
    Store = '[Sheet] Store',
    RestoreAll = '[Sheet] Restore All',
    FetchOne = '[Sheet] Fetch One',
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

export class StoreAction implements Action {
    readonly type = SheetActionTypes.Store;
    readonly payload : { character: ICharacter };
    
    constructor(character : ICharacter) {
        this.payload = { character };
    }
}

export class RestoreAllAction implements Action {
    readonly type = SheetActionTypes.RestoreAll;
    readonly payload : { characters: ICharacter[] };
    
    constructor(characters : ICharacter[]) {
        this.payload = { characters };
    }
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
    readonly payload : { data: Blob };
    
    constructor(data : Blob) {
        this.payload = { data };
    }
}

export type SheetActions = SetThemeAction | StoreAction | RestoreAllAction | FetchOneAction | UpdateAction | DeleteAction | DoDeleteAction;
