import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    Input
} from '@angular/core';

@Component({
    selector: 'jui-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'jui-page',
        '[class.jui-page-a4]': 'din == "a4"',
        '[class.jui-page-a5]': 'din == "a5"',
        '[class.jui-page-a6]': 'din == "a6"'
    }
})
export class PageComponent implements OnInit {
    @Input()
    din?: 'a4' | 'a5' | 'a6';

    constructor() {}

    ngOnInit() {}
}
