import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SetThemeAction } from '../+state/sheet.actions';
import { CharSheetState } from '../+state/state';

@Component({
    selector       : 'cs-sheet',
    templateUrl    : './sheet.component.html',
    styleUrls      : [ './sheet.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'cs-sheet',
        '[class.ancient]': 'theme == "ancient"'
    }
})
export class SheetComponent implements OnInit {
    // theme = 'default';
    theme = this.state.pipe(
        select('sheet', 'theme')
    );
    
    constructor(protected readonly state : Store<CharSheetState>) {
    }
    
    ngOnInit() {
    }
    
    setTheme(theme : string) {
        this.state.dispatch(new SetThemeAction(theme));
    }
    
}
