import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { defer, fromEvent, Subject } from 'rxjs';
import { filter, map, mapTo, mergeMap, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import {
    DeleteAction,
    DoDeleteAction,
    FetchOneAction,
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
                store.add(action.payload.character);
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
}
