import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { map, startWith } from 'rxjs/operators';
import { Level, RaiseService } from '@jina-draicana/sheet';


@Component({
    selector       : 'dw-raise',
    templateUrl    : './raise.component.html',
    styleUrls      : [ './raise.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'dw-raise mat-typography'
    }
})
export class RaiseComponent implements OnInit {


    readonly levels : Level[] = [ 'A*', 'A', 'B', 'C', 'D', 'E', 'F' ];

    displayedColumns = [ 'label', ...this.levels];


    table = Array.from({ length: 26 }, (_, i) => i).map(to => {
        return this.levels.reduce((t, c) => {
            t.costs[c] = {
                current: this.raiseService.getRaiseCosts(to, c),
                sum: 0
            }
            return t;
        }, {
            to,
            costs: {} as { [P in Level]: { current: number, sum: number } }
        })

        // return this.levels.reduce(level => {
        //     return {
        //         to,
        //         costs: this.raiseService.getRaiseCosts(to, level)
        //     }
        // })
    })

    // table = this.threshold.valueChanges.pipe(
    //     startWith(this.threshold.value),
    //     map(threshold => {
    //         return ([ [ this.i18n('Easy'), 1 ], [ this.i18n('Normal'), 3 ], [ this.i18n('Difficult'), 5 ]
    //             , [ this.i18n('Very Difficult'), 8 ], [ this.i18n('Impossible'), 12 ] ] as [ string, number ][]).map(([ label, successes ]) => {
    //             return {
    //                 label,
    //                 successes,
    //                 percentage: Array.from({ length: 15 }, (_, i) => chance(i + 1, successes, threshold) / 20 ** (i + 1) * 100)
    //             };
    //         })
    //     })
    // );

    constructor(protected readonly i18n : I18n,
        protected readonly raiseService : RaiseService) {
    }

    ngOnInit() {
    }

}
