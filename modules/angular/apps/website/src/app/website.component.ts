import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector   : 'dw-root',
    templateUrl: './website.component.html',
    styleUrls  : [ './website.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'dw-website'
    }
})
export class WebsiteComponent {}
