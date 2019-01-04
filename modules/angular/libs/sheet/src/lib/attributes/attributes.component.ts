import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    Input,
    EventEmitter,
    Output
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { COSTS, getCosts } from '@jina-draicana/presets';
import { combineLatest, Subscription } from 'rxjs';
import { debounceTime, map, pairwise, startWith, throttleTime } from 'rxjs/operators';

@Component({
    selector       : 'js-attributes',
    templateUrl    : './attributes.component.html',
    styleUrls      : [ './attributes.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'js-attributes mat-typography',
        '[class.js-attributes-button]': 'mode === "button"',
        '[class.js-attributes-range]': 'mode === "range"'
    },
    providers      : [ {
        provide    : NG_VALUE_ACCESSOR,
        useExisting: AttributesComponent,
        multi      : true
    } ]
})
export class AttributesComponent implements OnInit, ControlValueAccessor {
    @Input()
    set pointsAvailable(value : number) {
        this._pointsAvailable = value;
        this.pointsAvailableChange.emit(value);
    }
    get pointsAvailable() : number {
        return this._pointsAvailable;
    }
    protected _pointsAvailable?: number;
    
    @Input()
    mode : 'range' | 'button' = 'range';
    
    @Input()
    factor = 1;
    
    COSTS = COSTS;
    
    @Output()
    pointsAvailableChange = new EventEmitter<number>();
    
    form = new FormGroup({
        strength: new FormControl(null, Validators.required),
        agility: new FormControl(null, Validators.required),
        dexterity: new FormControl(null, Validators.required),
        constitution: new FormControl(null, Validators.required),
        courage: new FormControl(null, Validators.required),
        intelligence: new FormControl(null, Validators.required),
        intuition: new FormControl(null, Validators.required),
        charisma: new FormControl(null, Validators.required)
    });
    
    mins = {
        strength: 0,
        agility: 0,
        dexterity: 0,
        constitution: 0,
        courage: 0,
        intelligence: 0,
        intuition: 0,
        charisma: 0
    };
    
    subscription = Subscription.EMPTY;
    
    constructor() {
    }
    
    ngOnInit() {
        this.form.valueChanges.pipe(
            pairwise()
        ).subscribe(([ previous, current ]) => {
            let price = 0;
            for(const key in previous) {
                price += getCosts(previous[key], current[key]);
            }
            
            if(price) {
                this._pointsAvailable -= price * this.factor;
                this.pointsAvailableChange.emit(this._pointsAvailable);
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
            .subscribe(([status, value]) => {
                if ('VALID' === status) {
                    fn(value);
                } else {
                    fn(null);
                }
            });
    }
    
    registerOnTouched(fn : any) : void {
    }
    
    setDisabledState(isDisabled : boolean) : void {
        if (isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }
    
    writeValue(obj : any) : void {
        if(obj) {
            this.mins = obj;
            this.form.setValue(obj);
        }
    }
    
    add(type : string) {
        const control = this.form.get(type)!;
        control.setValue(control.value + 1);
    }
}
