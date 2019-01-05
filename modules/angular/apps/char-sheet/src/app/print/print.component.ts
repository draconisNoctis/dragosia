import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, first, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { SheetState } from '../+state/sheet.reducer';

@Component({
    selector       : 'cs-print',
    templateUrl    : './print.component.html',
    styleUrls      : [ './print.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'cs-print'
    }
})
export class PrintComponent {
    readonly theme = this.store.pipe(select('sheet', 'theme'));
    
    readonly char = combineLatest(
        this.route.paramMap.pipe(map(map => map.get('id'))),
        this.store.pipe(select('sheet', 'entities'))
    ).pipe(
        map(([ id, entities ]) => {
            if(!id || Object.keys(entities).length === 0) return;
            
            return entities[id];
        }),
        shareReplay(1)
    );
    
    constructor(protected readonly store : Store<SheetState>,
                protected readonly route : ActivatedRoute) {
    }
    
    @HostListener('window:load')
    onLoad() {
        this.char.pipe(
            filter(Boolean),
            first(),
            withLatestFrom(this.route.paramMap, (_, map) => map)
        ).subscribe((map) => {
            if(map.has('print')) {
                window.print();
                if(map.has('close')) {
                    window.close();
                }
            }
        })
    }
    
}
