import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';

@Component({
    selector       : 'dw-login',
    templateUrl    : './login.component.html',
    styleUrls      : [ './login.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'dw-login mat-typography'
    }
})
export class LoginComponent implements OnInit {
    loginForm = new FormGroup({
        email: new FormControl(null, [ Validators.required, Validators.email ]),
        password: new FormControl(null, [ Validators.required, Validators.minLength(6) ])
    });
    
    registerForm = new FormGroup({
        email: new FormControl(null, [ Validators.required, Validators.email ]),
        password: new FormControl(null, [ Validators.required, Validators.minLength(6) ])
    });
    
    constructor(protected readonly firebaseAuth : AngularFireAuth,
                protected readonly router : Router) {
    }
    
    ngOnInit() {
    }
    
    async loginWithGoogle() {
        await this.firebaseAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
        this.router.navigate([ '/' ]);
    }
    
    async loginWithEmailAndPassword() {
        if(!this.loginForm.valid) {
            return;
        }
        
        await this.firebaseAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password);
        this.router.navigate([ '/' ]);
    }
    
    async registerWithEmailAndPassword() {
        if(!this.registerForm.valid) {
            return;
        }
        await this.firebaseAuth.auth.createUserWithEmailAndPassword(this.registerForm.value.email, this.registerForm.value.password);
        this.router.navigate([ '/' ]);
    }
}
