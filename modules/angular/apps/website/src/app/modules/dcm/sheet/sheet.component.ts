import { BreakpointObserver } from '@angular/cdk/layout';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ICharacter } from '@jina-draicana/presets';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, merge } from 'rxjs';
import { filter, first, map, pairwise, scan, shareReplay, startWith, tap, withLatestFrom } from 'rxjs/operators';
import {
    DeleteAction,
    ExportAction,
    FetchOneAction, ImportAction,
    SetThemeAction,
    PutAction,
    UpdateAction,
    GetAllAction
} from '../+state/sheet.actions';
import { selectAllSheets } from '../+state/sheet.reducer';
import { CharSheetState } from '../+state/state';
import { CHARACTER_PROVIDER, IncreaseAttributeEvent, IncreaseSkillEvent, IncreaseGiftEvent, IncreaseTalentEvent } from '@jina-draicana/sheet';
import { WizardDialogComponent } from '../wizard-dialog/wizard-dialog.component';

@Component({
    selector       : 'cs-sheet',
    templateUrl    : './sheet.component.html',
    styleUrls      : [ './sheet.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'cs-sheet'
    }
})
export class SheetComponent implements OnInit {
    theme = this.store.pipe(
        select('sheet', 'theme')
    );

    chars = this.store.pipe(
        select(selectAllSheets),
    );


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
                this.exp = char.meta.exp.total - char.meta.exp.spend;
                this.generalControl.setValue(char, { emitEvent: false });
                this.advantagesControl.setValue({
                    advantages: char.advantages,
                    disadvantages: char.disadvantages
                }, { emitEvent: false });
                this.attributesControl.setValue(char.attributes, { emitEvent: false });
                this.skillsControl.setValue(char.skills, { emitEvent: false });
                this.giftsControl.setValue(char.gifts, { emitEvent: false });
                this.talentsControl.setValue(char.talents, { emitEvent: false });
            }
        }),
        shareReplay(1)
    );

    budget = this.char.pipe(
        map(char => char ? char.meta.exp.total - char.meta.exp.spend : 0)
    )

    generalControl = new FormControl();
    attributesControl = new FormControl();
    skillsControl = new FormControl();
    giftsControl = new FormControl();
    talentsControl = new FormControl();
    advantagesControl = new FormControl();

    get exp() {
        return this._exp.getValue();
    }
    set exp(value : number|null) {
        this._exp.next(value);
    }

    protected _exp = new BehaviorSubject<number|null>(null);

    sidenavToggle = new EventEmitter<void|boolean>();

    isMobile = this.breakpointObserver.observe('(max-width: 1024px)').pipe(map(v => v.matches));

    isDesktop = this.isMobile.pipe(map(v => !v));

    sidenavOpen = combineLatest(
        this.isDesktop,
        this.sidenavToggle.pipe(startWith(false), scan<boolean, void|boolean>((t, c) => null == c ? !t : c, false))
    ).pipe(
        map(([ isDesktop, isOpen ]) => isDesktop || isOpen)
    );

    constructor(protected readonly store : Store<CharSheetState>,
                protected readonly route : ActivatedRoute,
                protected readonly dialog : MatDialog,
                protected readonly router : Router,
                protected readonly cdr : ChangeDetectorRef,
                protected readonly breakpointObserver : BreakpointObserver,
                public readonly firebaseAuth : AngularFireAuth) {
    }

    ngOnInit() {
        this.store.dispatch(new GetAllAction());
        const exp = this._exp.pipe(pairwise());

        merge(
            this.generalControl.valueChanges.pipe(filter(Boolean)),
            // this.advantagesControl.valueChanges.pipe(filter(Boolean)),
            // this.attributesControl.valueChanges.pipe(filter(Boolean), map(attributes => ({ attributes }))),
            // this.skillsControl.valueChanges.pipe(filter(Boolean), map(skills => ({ skills }))),
            // this.giftsControl.valueChanges.pipe(filter(Boolean), map(gifts => ({ gifts }))),
            // this.talentsControl.valueChanges.pipe(filter(Boolean), map(talents => ({ talents })))
        ).pipe(
            withLatestFrom(exp, this.char),
            map(([ partial, exp, char ]) => {
                const costs = exp[0] - exp[1];
                char = { ...char, ...partial };
                char.meta.exp.spend += costs;

                return new UpdateAction(char);
            }),
            filter(Boolean)
        ).subscribe(this.store);
    }

    increaseAttribute(event : IncreaseAttributeEvent, char : ICharacter) {
        char.attributes[event.attribute] = event.value;
        char.meta.exp.spend += event.costs;

        this.store.dispatch(new UpdateAction(char));
    }

    increaseSkill(event : IncreaseSkillEvent, char : ICharacter) {
        char.skills[event.skill] = event.value;
        char.meta.exp.spend += event.costs;

        this.store.dispatch(new UpdateAction(char));
    }

    increaseGift(event : IncreaseGiftEvent, char : ICharacter) {
        const index = char.gifts.findIndex(gift => gift.name === event.gift.name)
        if(-1 === index) {
            char.gifts.push(event.gift);
        } else {
            char.gifts[index] = event.gift;
        }
        char.meta.exp.spend += event.costs;

        this.store.dispatch(new UpdateAction(char));
    }

    increaseTalent(event : IncreaseTalentEvent, char : ICharacter) {
        const index = char.talents[event.type].findIndex(talent => talent.name === event.talent.name)
        if(-1 === index) {
            char.talents[event.type].push(event.talent);
        } else {
            char.talents[event.type][index] = event.talent;
        }
        char.meta.exp.spend += event.costs;

        this.store.dispatch(new UpdateAction(char));
    }

    setTheme(theme : string) {
        this.store.dispatch(new SetThemeAction(theme));
    }

    doStore(char : ICharacter) {
        this.store.dispatch(new PutAction(char));
    }

    doUpdate(value : ICharacter) {
        this.store.dispatch(new UpdateAction(value));
    }

    doDiscard(char : ICharacter) {
        this.store.dispatch(new FetchOneAction(char._id));
    }

    doDelete(char : ICharacter) {
        this.store.dispatch(new DeleteAction(char));
    }

    async openWizard(provider : CHARACTER_PROVIDER) {
        const ref = this.dialog.open(WizardDialogComponent, {
            maxWidth: '100vw',
            maxHeight: '90vh'
        });

        const result = await ref.afterClosed().toPromise();

        if(result) {
            this.store.dispatch(new PutAction({ ...result, provider }));
            this.router.navigate([ '/dcm', result._id ])
        }
    }

    export(char : ICharacter) {
        this.store.dispatch(new ExportAction(char));
    }

    import(event : Event, provider: CHARACTER_PROVIDER) {
        const target = event.target as HTMLInputElement;

        this.store.dispatch(new ImportAction(target.files[0], provider));

        target.type = 'text';
        target.value = '';
        target.type = 'file';
    }
}

function sleep(ms : number) : Promise<void> {
    return new Promise<void>(resolve => setTimeout(() => resolve(), ms));
}
