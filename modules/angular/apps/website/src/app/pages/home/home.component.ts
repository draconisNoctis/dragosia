import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector       : 'dw-home',
    templateUrl    : './home.component.html',
    styleUrls      : [ './home.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'dw-home'
    }
})
export class HomeComponent {
    searchControl = new FormControl(null, Validators.required);
    
    constructor(protected readonly router : Router) {
    }
    
    search() {
        if(!this.searchControl.valid) {
            return;
        }
        this.router.navigate([ '/search'], {
            queryParams: { q: this.searchControl.value }
        })
    }
}
