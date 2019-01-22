import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ICharacter } from '@jina-draicana/presets';
import { from, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CharacterFirebaseService {
    
    constructor(protected readonly firebaseAuth : AngularFireAuth,
                protected readonly firebaseFirestore : AngularFirestore) {
    }
    
    
    isAvailable() : Observable<boolean> {
        return this.firebaseAuth.user.pipe(map(Boolean));
    }
    
    getAll() : Observable<ICharacter[]> {
        return this.firebaseAuth.user.pipe(
            first(),
            switchMap(user => {
                if(!user) {
                    throw new Error('missing user');
                }
                
                return this.firebaseFirestore.collection<ICharacter>('characters', ref => {
                    return ref.where('_user', '==', user.uid)
                }).valueChanges().pipe(first());
            })
        )
    }
    
    get(id : string) : Observable<ICharacter> {
        return this.firebaseFirestore.collection('characters').doc<ICharacter>(id).valueChanges().pipe(first());
    }
    
    put(character : ICharacter) : Observable<void> {
        return this.firebaseAuth.user.pipe(
            first(),
            switchMap(user => {
                return from(this.firebaseFirestore.collection('characters').doc<ICharacter>(character._id).set({
                    ...character,
                    _user: user.uid
                }));
            })
        );
    }
    
    delete(character : ICharacter) : Observable<void> {
        return from(this.firebaseFirestore.doc(`characters/${character._id}`).delete());
    }
}
