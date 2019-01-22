import { Injectable } from '@angular/core';
import { ICharacter } from '@jina-draicana/presets';
import { combineLatest, Observable, throwError } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { CharacterFirebaseService } from './character/character-firebase.service';
import { CharacterLocalService } from './character/character-local.service';

export const CURRENT_CHARACTER_VERSION = 1;

@Injectable({
    providedIn: 'root'
})
export class CharacterService {
    readonly services : [ CHARACTER_PROVIDER, ICharacterService ][];
    
    readonly versions : [ number, (char : ICharacter) => ICharacter ][] = [
        [1, (char : ICharacter) => {
            if(!char.provider) {
                char.provider = 'local';
            }
            return char;
        } ]
    ] as any;
    
    constructor(local : CharacterLocalService, firebase : CharacterFirebaseService) {
        this.services = [
            [ 'firebase', firebase ],
            [ 'local', local]
        ];
    }
    
    protected exec<T>(fn : (service : ICharacterService) => Observable<T>) : Observable<T[]>;
    protected exec<T>(fn : (service : ICharacterService) => Observable<T>, provider : CHARACTER_PROVIDER) : Observable<T>
    protected exec<T>(fn : (service : ICharacterService) => Observable<T>, provider? : CHARACTER_PROVIDER) : Observable<T|T[]> {
        if(!provider) {
            return combineLatest(...this.services.map(([ name, service ]) => {
                return service.isAvailable().pipe(
                    first(),
                    filter(Boolean),
                    switchMap(() => fn(service))
                )
            }))
        }
        
        const providerService = this.services.find(([ name ]) => name === provider);
        
        if(!providerService) {
            return throwError(new Error(`Cannot find provider "${provider}"`));
        }
        
        return providerService[1].isAvailable().pipe(
            tap(foo => console.log(foo)),
            switchMap(isAvailable => {
                if(!isAvailable) {
                    throw new Error(`Provider "${provider}" is not available`);
                }
                
                return fn(providerService[1]);
            })
        )
    }
    
    protected patchCharacter(char : ICharacter) : ICharacter {
        let version = char.version || 0;
        
        for(const [ v, patcher ] of this.versions) {
            if(v > version) {
                char = patcher(char);
                char.version = v;
            } else {
                break;
            }
        }
        
        return char;
    }
    
    getAll() : Observable<ICharacter[]> {
        return this.exec<ICharacter[]>(service => service.getAll()).pipe(
            map(results => {
                const characters = results.reduce<ICharacter[]>((t, c) => t.concat(c), [])
                    .filter((c, i, a) => i === a.findIndex(c1 => c1._id === c._id))
                    .map(char => this.patchCharacter(char));
                
                return characters;
            })
        )
    }
    
    get(id : string) : Observable<ICharacter> {
        return this.exec<ICharacter>(service => service.get(id)).pipe(
            map(results => results.find(Boolean)),
            map(char => char && this.patchCharacter(char))
        )
    }
    
    put(character : ICharacter) : Observable<void> {
        character = this.patchCharacter(character);
        return this.exec<void>(service => service.put(character), character.provider);
    }
    
    delete(character : ICharacter) : Observable<void> {
        return this.exec<void>(service => service.put(character), character.provider);
    }
}

export type CHARACTER_PROVIDER = 'local'|'firebase';

export interface ICharacterService {
    isAvailable() : Observable<boolean>;
    
    getAll() : Observable<ICharacter[]>;
    
    get(id : string) : Observable<ICharacter>;
    
    put(character : ICharacter) : Observable<void>;
    
    delete(character : ICharacter) : Observable<void>;
}
