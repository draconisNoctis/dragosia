import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter, ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import {
    COSTS,
    getCosts,
    ICharacterTalent,
    ICharacterTalents, IGift,
    IPartialTalent,
    ITalent,
    Presets
} from '@jina-draicana/presets';
import { combineLatest, Subscription } from 'rxjs';
import { pairwise, startWith, throttleTime } from 'rxjs/operators';
import { AddDialogComponent } from './add-dialog/add-dialog.component';

@Component({
    selector       : 'js-talents',
    templateUrl    : './talents.component.html',
    styleUrls      : [ './talents.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class'                    : 'js-talents mat-typography',
        '[class.js-talents-button]': 'mode === "button"',
        '[class.js-talents-range]' : 'mode === "range"'
    },
    providers      : [ {
        provide    : NG_VALUE_ACCESSOR,
        useExisting: TalentsComponent,
        multi      : true
    } ]
})
export class TalentsComponent implements OnInit, ControlValueAccessor {
    @Input()
    set preset(preset : string) {
        this.talents = this.presets.getTalentsForPreset(preset);
    }
    
    @Input()
    set pointsAvailable(value : number) {
        this._pointsAvailable = value;
        this.pointsAvailableChange.emit(value);
    }
    
    get pointsAvailable() : number {
        return this._pointsAvailable;
    }
    
    protected _pointsAvailable? : number;
    
    @Input()
    mode : 'range' | 'button' = 'range';
    
    @Output()
    pointsAvailableChange = new EventEmitter<number>();
    
    COSTS = COSTS;
    
    talents? : IPartialTalent[];
    
    meleeForm = new FormArray([]);
    rangeForm = new FormArray([]);
    physicalForm = new FormArray([]);
    mentalForm = new FormArray([]);
    giftsForm = new FormArray([]);
    
    form = new FormGroup({
        melee   : this.meleeForm,
        range   : this.rangeForm,
        physical: this.physicalForm,
        mental  : this.mentalForm,
        gifts   : this.giftsForm
    });
    
    mins : { [P in keyof ICharacterTalents] : number[] } = {
        melee   : [],
        range   : [],
        physical: [],
        mental  : [],
        gifts   : []
    };
    
    subscription = Subscription.EMPTY;
    
    constructor(protected readonly dialog : MatDialog,
                protected readonly presets : Presets,
                protected readonly cdr : ChangeDetectorRef) {
    }
    
    ngOnInit() {
        this.form.valueChanges.pipe(
            pairwise()
        ).subscribe(([ previous, current ]) => {
            let price = 0;
            for(const key in current) {
                for(const i in current[ key ]) {
                    price += getCosts(previous[ key ][ i ] ? previous[ key ][ i ].value : -1, current[ key ][ i ].value);
                }
            }
            
            if(price) {
                this.pointsAvailable -= price;
            }
        });
    }
    
    registerOnChange(fn : any) : void {
        this.subscription.unsubscribe();
        this.subscription = combineLatest(
            this.form.statusChanges,
            this.form.valueChanges
        )
            .pipe(throttleTime(1))
            .subscribe(([ status, value ]) => {
                if('VALID' === status) {
                    fn(value);
                } else {
                    fn(null);
                }
            });
    }
    
    registerOnTouched(fn : any) : void {
    }
    
    setDisabledState(isDisabled : boolean) : void {
        if(isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }
    
    writeValue(obj : any) : void {
        for(const key of [ 'melee', 'range', 'physical', 'mental', 'gifts' ] as (keyof ICharacterTalents)[]) {
            const control = this.form.get(key) as FormArray;
            while(control.length) {
                control.removeAt(0);
            }
            
            if(obj) {
                this.mins[ key ] = obj[ key ].map(o => o.value);
                for(const talent of obj[ key ]) {
                    if(talent.name) {
                        this.addTalent(talent, key);
                    }
                }
            }
        }
    }
    
    addTalent(talent : ICharacterTalent, category : keyof ICharacterTalents) {
        (this.form.get(category) as FormArray).push(new FormGroup({
            attribute: new FormControl(talent.attribute, Validators.required),
            skill    : new FormControl(talent.skill, Validators.required),
            name     : new FormControl(talent.name, Validators.required),
            value    : new FormControl(talent.value || 0, Validators.required)
        }))
    }
    
    
    async openAddDialog() {
        const v : ICharacterTalents = this.form.value;
        const ref = this.dialog.open(AddDialogComponent, {
            data: {
                talents: this.talents.filter(talent => {
                    return ![ ...v.melee, ...v.range, ...v.physical, ...v.mental, ...v.gifts ].some(t => t.name === talent.name);
                })
            }
        });
        
        const result = await ref.afterClosed().toPromise();
        
        if(result) {
            this.addTalent(result, result.category);
            this.mins[ result.category ].push(0);
            this.pointsAvailable -= 1;
            this.cdr.markForCheck();
        }
    }
    
    
    add(type : string, index : number) {
        const control = this.form.get([ type, index, 'value' ])!;
        control.setValue(control.value + 1);
    }
    
}
