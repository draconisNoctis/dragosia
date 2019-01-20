import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { defer, fromEvent, fromEventPattern, Subject } from 'rxjs';
import { filter, flatMap, map, mapTo, mergeMap, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import {
    DeleteAction,
    DoDeleteAction, ExportAction,
    FetchOneAction, ImportAction,
    RestoreAllAction,
    SheetActionTypes,
    StoreAction
} from './sheet.actions';

@Injectable()
export class SheetEffects {
    protected _db = indexedDB.open('Chars', 1);
    
    _1 = this._db.onupgradeneeded = () => {
        const store = this._db.result!.createObjectStore('characters', { keyPath: '_id' });
        
        store.transaction.oncomplete = () => {
            this.$db.next(this._db.result!);
        }
        
    };
    
    _2 = this._db.onsuccess = () => {
        this.$db.next(this._db.result!);
    };
    
    $db = new Subject<IDBDatabase>();
    db = this.$db.pipe(
        shareReplay(1)
    );
    
    
    @Effect()
    $init = defer(() => {
        return this.db.pipe(
            switchMap(db => {
                const transaction = db.transaction('characters', 'readonly');
                const store = transaction.objectStore('characters');
                
                const req = store.getAll();
                return fromEvent(req, 'success').pipe(
                    map(() => req.result!),
                    map(chars => new RestoreAllAction(chars))
                )
            })
        )
    });
    
    constructor(protected readonly actions$ : Actions,
                protected readonly dialog : MatDialog,
                protected readonly i18n : I18n) {
    }
    
    @Effect({ dispatch: false })
    onStore() {
        return this.actions$.pipe(
            ofType<StoreAction>(SheetActionTypes.Store),
            withLatestFrom(this.db),
            tap(([ action, db ]) => {
                const store = db.transaction('characters', 'readwrite').objectStore('characters');
                store.put(action.payload.character);
            })
        )
    }
    
    @Effect()
    onFetchOne() {
        return this.actions$.pipe(
            ofType<FetchOneAction>(SheetActionTypes.FetchOne),
            withLatestFrom(this.db),
            switchMap(([ action, db ]) => {
                const store = db.transaction('characters', 'readonly').objectStore('characters');
                
                const req = store.get(action.payload.id);
                
                return fromEvent(req, 'success').pipe(
                    map(() => req.result!),
                    map(res => new RestoreAllAction([ { ...res, _changed: undefined } ]))
                )
            })
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
            }),
            tap(a => console.log(a))
        )
    }
    
    
    @Effect()
    onDoDelete() {
        return this.actions$.pipe(
            ofType<DoDeleteAction>(SheetActionTypes.DoDelete),
            withLatestFrom(this.db),
            mergeMap(([ action, db ]) => {
                const store = db.transaction('characters', 'readwrite').objectStore('characters');
        
                const req = store.delete(action.payload.character._id);
        
                return fromEvent(req, 'error').pipe(
                    map(err => {
                        console.error(err);
                        alert(this.i18n('An Error occured while deleting character "{{character}}"', {
                            character: action.payload.character.about.name
                        }));
                        
                        return new FetchOneAction(action.payload.character._id);
                    })
                )
            })
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
                    map(() => JSON.parse(reader.result as string))
                );
            }),
            map(char => new StoreAction(char))
        )
    }
}
