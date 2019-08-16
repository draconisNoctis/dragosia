import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { defer, fromEvent } from 'rxjs';
import { filter, flatMap, map, mapTo, mergeMap, switchMap, tap, ignoreElements, withLatestFrom } from 'rxjs/operators';
import { CharacterService } from '../../../../../../../libs/sheet/src/lib/character.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import {
    DeleteAction,
    DoDeleteAction,
    ExportAction,
    FetchOneAction,
    ImportAction,
    StoreAllAction,
    SheetActionTypes,
    PutAction,
    FetchAllAction
} from './sheet.actions';
import { SheetState, selectAllSheets } from './sheet.reducer';
import { Store, select } from '@ngrx/store';

@Injectable()
export class SheetEffects {

    // @Effect()
    // $init = defer(() => {
    //     return this.characterService.getAll().pipe(
    //         map(chars => new StoreAllAction(chars))
    //     )
    // });

    constructor(protected readonly actions$ : Actions,
                protected readonly store$ : Store<SheetState>,
                protected readonly dialog : MatDialog,
                protected readonly characterService : CharacterService,
                protected readonly i18n : I18n) {
    }

    @Effect()
    onGetAll() {
        return this.actions$.pipe(
            ofType(SheetActionTypes.GetAll),
            withLatestFrom(this.store$.pipe(select(selectAllSheets))),
            map(([ _, sheets ]) => {
                if(sheets.length) {
                    return null;
                }
                return new FetchAllAction();
            }),
            filter(Boolean)
        )
    }

    @Effect()
    onFetchAll() {
        return this.actions$.pipe(
            ofType(SheetActionTypes.FetchAll),
            switchMap(() => this.characterService.getAll()),
            map(sheets => new StoreAllAction(sheets))
        )
    }

    @Effect({ dispatch: false })
    onStore() {
        return this.actions$.pipe(
            ofType<PutAction>(SheetActionTypes.Put),
            switchMap(action => this.characterService.put(action.payload.character))
        )
    }

    @Effect()
    onFetchOne() {
        return this.actions$.pipe(
            ofType<FetchOneAction>(SheetActionTypes.FetchOne),
            switchMap(action => this.characterService.get(action.payload.id)),
            map(char => new StoreAllAction([ { ...char, _changed: undefined } ]))
        )
    }

    @Effect()
    onDelete() {
        return this.actions$.pipe(
            ofType<DeleteAction>(SheetActionTypes.Delete),
            mergeMap(action => {
                const ref = this.dialog.open(ConfirmDeleteDialogComponent, {
                    data: action.payload
                });

                return ref.afterClosed().pipe(
                    filter(Boolean),
                    mapTo(new DoDeleteAction(action.payload.character))
                )
            })
        )
    }


    @Effect({ dispatch: false })
    onDoDelete() {
        return this.actions$.pipe(
            ofType<DoDeleteAction>(SheetActionTypes.DoDelete),
            switchMap(action => this.characterService.delete(action.payload.character)),
        )
    }

    @Effect({ dispatch: false })
    export() {
        return this.actions$.pipe(
            ofType<ExportAction>(SheetActionTypes.Export),
            tap(action => {
                const jsonStr = JSON.stringify(action.payload.character);
                const blob = new Blob([ jsonStr ], { type: 'application/octet-binary' });

                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.download = `${action.payload.character.about.name}.json`;

                var evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);

                a.dispatchEvent(evt);
            })
        )
    }

    @Effect()
    import() {
        return this.actions$.pipe(
            ofType<ImportAction>(SheetActionTypes.Import),
            flatMap(action => {
                const reader = new FileReader();

                reader.readAsText(action.payload.data);

                return fromEvent(reader, 'load').pipe(
                    map(() => JSON.parse(reader.result as string)),
                    tap(char => char.provider = action.payload.provider)
                );
            }),
            map(char => new PutAction(char))
        )
    }
}
