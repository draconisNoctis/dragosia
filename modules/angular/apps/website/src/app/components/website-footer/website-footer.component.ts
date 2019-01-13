import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'dw-website-footer',
    templateUrl    : './website-footer.component.html',
    styleUrls      : [ './website-footer.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'dw-website-footer'
    }
})
export class WebsiteFooterComponent implements OnInit {
    
    constructor() {
    }
    
    ngOnInit() {
    }
    
}
