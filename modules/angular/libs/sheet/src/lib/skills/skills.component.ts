import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { getCosts } from '@jina-draicana/presets';
import { combineLatest, Subscription } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';

@Component({
    selector       : 'js-skills',
    templateUrl    : './skills.component.html',
    styleUrls      : [ './skills.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'js-skills mat-typography'
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
    factor = 1;
    
    @Output()
    next = new EventEmitter<void>();
    
    @Output()
    pointsAvailableChange = new EventEmitter<number>();
    
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
            startWith(null),
            pairwise()
        ).subscribe(([ previous, current ]) => {
            if(null === previous) {
                return;
            }
            
            let price = 0;
            for(const key in previous) {
                price += getCosts(previous[key], current[key]);
            }
            
            if(price) {
                this._pointsAvailable -= price;
                this.pointsAvailableChange.emit(this._pointsAvailable);
            }
        });
    }
    
    registerOnChange(fn : any) : void {
        this.subscription.unsubscribe();
        this.subscription = combineLatest(
            this.form.statusChanges,
            this.form.valueChanges,
            this.pointsAvailableChange
        )
            .pipe(startWith([this.form.status, this.form.value, 0]))
            .subscribe(([status, value, pointsAvailable]) => {
                if ('VALID' === status && 0 <= pointsAvailable) {
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
    
    
}
