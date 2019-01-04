import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { COSTS, getCosts } from '@jina-draicana/presets';
import { combineLatest, Subscription } from 'rxjs';
import { pairwise, startWith, throttleTime } from 'rxjs/operators';

@Component({
    selector       : 'js-skills',
    templateUrl    : './skills.component.html',
    styleUrls      : [ './skills.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'js-skills mat-typography',
        '[class.js-skills-button]': 'mode === "button"',
        '[class.js-skills-range]': 'mode === "range"'
    },
    providers      : [ {
        provide    : NG_VALUE_ACCESSOR,
        useExisting: SkillsComponent,
        multi      : true
    } ]
})
export class SkillsComponent implements OnInit, ControlValueAccessor {
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
    
    @Output()
    pointsAvailableChange = new EventEmitter<number>();
    
    COSTS = COSTS;
    
    form = new FormGroup({
        melee: new FormControl(null, Validators.required),
        range: new FormControl(null, Validators.required),
        physical: new FormControl(null, Validators.required),
        mental: new FormControl(null, Validators.required)
    });
    
    mins = {
        melee: 0,
        range: 0,
        physical: 0,
        mental: 0
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
                    fn(null)
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
            this.form.setValue(obj);
            this.mins = obj;
        }
    }
    
    add(type : string) {
        const control = this.form.get(type)!;
        control.setValue(control.value + 1);
    }
}
