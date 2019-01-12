import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

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
export class HomeComponent implements OnInit {
    
    constructor() {
    }
    
    ngOnInit() {
    }
    
}
