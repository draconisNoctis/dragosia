import { Injectable } from '@angular/core';
import { ICharacter } from '@jina-draicana/presets';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { map, mapTo, shareReplay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CharacterLocalService {
    db = new Observable<IDBDatabase>(obs => {
        const db = indexedDB.open('Chars', 1);
    
        db.onupgradeneeded = () => {
            const store = db.result!.createObjectStore('characters', { keyPath: '_id' });
        
            store.transaction.oncomplete = () => {
                obs.next(db.result!);
            };
        };
        
        db.onsuccess = () => {
            obs.next(db.result!);
        };
    
        db.onerror = () => {
            obs.error(db.error);
        }
    }).pipe(
        shareReplay(1)
    );
    
    constructor() {
    }
    
    protected exec<T>(fn : (store : IDBObjectStore) => IDBRequest<T>, mode : 'readwrite' | 'readonly' = 'readonly') : Observable<T> {
        return this.db.pipe(
            switchMap(db => {
                const store = db.transaction('characters', mode).objectStore('characters');
            
                const req = fn(store);
                return merge(
                    fromEvent(req, 'success').pipe(
                        map(() => req.result!)
                    ),
                    fromEvent(req, 'error').pipe(
                        map(() => {
                            throw req.error
                        })
                    )
                )
            })
        )
    }
    
    isAvailable() : Observable<boolean> {
        return of(true);
    }
    
    getAll() : Observable<ICharacter[]> {
        return this.exec<ICharacter[]>(store => store.getAll());
    }
    
    get(id : string) : Observable<ICharacter> {
        return this.exec<ICharacter>(store => store.get(id));
    }
    
    put(character : ICharacter) : Observable<void> {
        return this.exec<IDBValidKey>(store => store.put(character), 'readwrite').pipe(mapTo(undefined));
    }
    
    delete(character : ICharacter) : Observable<void> {
        return this.exec<void>(store => store.delete(character._id), 'readwrite');
    }
}
