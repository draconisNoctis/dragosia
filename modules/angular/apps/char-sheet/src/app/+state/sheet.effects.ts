import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { defer, fromEvent, Subject } from 'rxjs';
import { map, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { FetchOneAction, RestoreAllAction, SheetActionTypes, StoreAction } from './sheet.actions';

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
    
    constructor(private actions$ : Actions) {
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
}
