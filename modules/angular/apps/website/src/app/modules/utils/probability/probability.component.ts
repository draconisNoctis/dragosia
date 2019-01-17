import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector       : 'dw-probability',
    templateUrl    : './probability.component.html',
    styleUrls      : [ './probability.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'dw-probabilty mat-typography'
    }
})
export class ProbabilityComponent implements OnInit {
    
    displayedColumns = [ 'label', 'dices:1', 'dices:2', 'dices:3', 'dices:4', 'dices:5', 'dices:6', 'dices:7', 'dices:8',
        'dices:9', 'dices:10', 'dices:11', 'dices:12', 'dices:13', 'dices:14', 'dices:15' ];
    
    threshold = new FormControl(11);
    
    table = this.threshold.valueChanges.pipe(
        startWith(this.threshold.value),
        map(threshold => {
            return ([ [ this.i18n('Easy'), 1 ], [ this.i18n('Normal'), 3 ], [ this.i18n('Difficult'), 5 ]
                , [ this.i18n('Very Difficult'), 8 ], [ this.i18n('Impossible'), 12 ] ] as [ string, number ][]).map(([ label, successes ]) => {
                return {
                    label,
                    successes,
                    percentage: Array.from({ length: 15 }, (_, i) => chance(i + 1, successes, threshold) / 20 ** (i + 1) * 100)
                };
            })
        })
    );
    
    constructor(protected readonly i18n : I18n) {
    }
    
    ngOnInit() {
    }
    
}

function chance(dices : number, neededSuccesses : number, threshold : number, sides : number = 20) {
    if(neededSuccesses > dices) {
        return 0;
    }
    if(dices <= 0) {
        return 1;
    }
    if(neededSuccesses <= 0) {
        return sides ** dices;
    }
    
    const o = sides - threshold + 1;
    
    const r = o * chance(dices - 1, neededSuccesses - 1, threshold, sides);
    const w = (sides - o) * chance(dices - 1, neededSuccesses, threshold, sides);
    
    return r + w;
}
