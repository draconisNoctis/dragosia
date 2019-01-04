import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ICharacter } from '@jina-draicana/presets';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, merge, NEVER } from 'rxjs';
import { filter, first, map, pairwise, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { SetThemeAction, StoreAction, UpdateAction } from '../+state/sheet.actions';
import { selectAllSheets } from '../+state/sheet.reducer';
import { CharSheetState } from '../+state/state';
import { WizardDialogComponent } from '../wizard-dialog/wizard-dialog.component';

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
    
    watch = new BehaviorSubject<boolean>(false);
    
    char = combineLatest(
        this.route.paramMap.pipe(map(map => map.get('id'))),
        this.store.pipe(select('sheet', 'entities'))
    ).pipe(
        map(([ id, entities ]) => {
            if(!id || Object.keys(entities).length === 0) return;
            
            return entities[id];
        }),
        tap((char : ICharacter) => {
            if(char) {
                console.log({ char });
                this.watch.next(false);
                this.exp = char.meta.exp.total - char.meta.exp.spend;
                this.attributesControl.setValue(char.attributes, { emitEvent: false });
                this.skillsControl.setValue(char.skills, { emitEvent: false });
                this.giftsControl.setValue(char.gifts, { emitEvent: false });
                this.talentsControl.setValue(char.talents, { emitEvent: false });
                this.watch.next(true);
            }
        }),
        shareReplay(1)
    );
    
    attributesControl = new FormControl();
    skillsControl = new FormControl();
    giftsControl = new FormControl();
    talentsControl = new FormControl();
    
    get exp() {
        return this._exp.getValue();
    }
    set exp(value : number|null) {
        this._exp.next(value);
    }
    
    protected _exp = new BehaviorSubject<number|null>(null);
    
    sidenavOpen = true;
    
    constructor(protected readonly store : Store<CharSheetState>,
                protected readonly route : ActivatedRoute,
                protected readonly dialog : MatDialog,
                protected readonly router : Router,
                protected readonly cdr : ChangeDetectorRef) {
    }
    
    ngOnInit() {
        const exp = this._exp.pipe(pairwise(), shareReplay(1));
        
        const obs = merge(
            this.attributesControl.valueChanges.pipe(filter(Boolean), map(attributes => ({ attributes }))),
            this.skillsControl.valueChanges.pipe(filter(Boolean), map(skills => ({ skills }))),
            this.giftsControl.valueChanges.pipe(filter(Boolean), map(gifts => ({ gifts }))),
            this.talentsControl.valueChanges.pipe(filter(Boolean), map(talents => ({ talents })))
        ).pipe(
            withLatestFrom(exp, this.char),
            map(([ partial, exp, char ]) => {
                console.log({ partial, exp, char });
                const costs = exp[0] - exp[1];
                Object.assign(char, partial);
                char.meta.exp.spend += costs;
    
                return new UpdateAction(char);
            }),
            filter(Boolean)
        );
        
        // const o = this.attributesControl.valueChanges.pipe(
        //     withLatestFrom(exp, this.char),
        //     map(([ attributes, exp, char ]) => {
        //         console.log({ attributes, exp, char });
        //         if(attributes && exp[1] > 0) {
        //             const costs = exp[0] - exp[1];
        //             char.attributes = attributes;
        //             char.meta.exp.spend += costs;
        //
        //             return new UpdateAction(char);
        //         }
        //     }),
        //     filter(Boolean)
        // );
        
        this.watch.pipe(
            switchMap(w => w ? obs : NEVER)
        ).subscribe(this.store);
    }
    
    setTheme(theme : string) {
        this.store.dispatch(new SetThemeAction(theme));
    }
    
    doStore() {
        this.char.pipe(
            first(),
            map(char => new StoreAction(char))
        ).subscribe(this.store);
    }
    
    doUpdate(value : ICharacter) {
        this.store.dispatch(new UpdateAction(value));
    }
    
    async openWizard() {
        const ref = this.dialog.open(WizardDialogComponent);
        
        const result = await ref.afterClosed().toPromise();
        
        if(result) {
            this.store.dispatch(new StoreAction(result));
            this.router.navigate([ '/', result._id ])
        }
    }
    
    async print() {
        this.sidenavOpen = false;
        await sleep(1000);
        window.print();
        await sleep(10);
        this.sidenavOpen = true;
        this.cdr.markForCheck();
    }
}

function sleep(ms : number) : Promise<void> {
    return new Promise<void>(resolve => setTimeout(() => resolve(), ms));
}
