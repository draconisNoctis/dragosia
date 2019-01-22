import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { first, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(protected readonly firebaseAuth : AngularFireAuth,
                protected readonly router : Router) {}
    
    canActivate(
        next : ActivatedRouteSnapshot,
        state : RouterStateSnapshot) {
        return this.firebaseAuth.user.pipe(
            first(),
            map(user => {
                if(user) {
                    this.router.navigate([ '/' ]);
                    return false;
                    // doesn't work :/
                    // return this.router.createUrlTree([ '/' ]);
                } else {
                    return true;
                }
            })
        );
    }
}
