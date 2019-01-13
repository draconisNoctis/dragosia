import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector       : 'dw-website-header',
    templateUrl    : './website-header.component.html',
    styleUrls      : [ './website-header.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'dw-website-header'
    }
})
export class WebsiteHeaderComponent {
    @Input()
    set query(q : string) {
        this.searchForm.reset({ q }, { emitEvent: false });
    }
    
    searchForm = new FormGroup({
        q: new FormControl(null, Validators.required)
    });
    
    constructor(protected readonly router : Router) {
    }
    
    search() {
        if(!this.searchForm.valid) {
            return;
        }
        this.router.navigate([ '/search'], {
            queryParams: this.searchForm.value
        })
    }
}
