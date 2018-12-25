import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SetThemeAction, StoreAction, UpdateAction } from '../+state/sheet.actions';
import { ICharacter, selectAllSheets } from '../+state/sheet.reducer';
import { CharSheetState } from '../+state/state';
import { SheetComponent as CharSheetComponent } from '@jina-draicana/sheet';

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
    theme = this.store.pipe(
        select('sheet', 'theme')
    );
    
    chars = this.store.pipe(
        select(selectAllSheets)
    );
    
    char = combineLatest(
        this.route.paramMap.pipe(map(map => map.get('id'))),
        this.store.pipe(select('sheet', 'entities'))
    ).pipe(map(([ id, entities ]) => {
        if(!id || Object.keys(entities).length === 0) return;
        
        return entities[id];
    }));
    
    @ViewChild(CharSheetComponent)
    sheet!: CharSheetComponent;
    
    constructor(protected readonly store : Store<CharSheetState>,
                protected readonly route : ActivatedRoute) {
    }
    
    ngOnInit() {
    
    }
    
    setTheme(theme : string) {
        this.store.dispatch(new SetThemeAction(theme));
    }
    
    doStore() {
        this.store.dispatch(new StoreAction(this.sheet.form.value));
    }
    
    doUpdate(value : ICharacter) {
        this.store.dispatch(new UpdateAction(value));
    }
    
}
