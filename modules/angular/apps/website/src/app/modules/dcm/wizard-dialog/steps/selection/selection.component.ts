import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ISelectTalents } from '@jina-draicana/presets';
import { combineLatest, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
    selector       : 'cs-selection',
    exportAs       : 'csSelection',
    templateUrl    : './selection.component.html',
    styleUrls      : [ './selection.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        class: 'cs-selection'
    },
    providers      : [
        {
            provide    : NG_VALUE_ACCESSOR,
            useExisting: SelectionComponent,
            multi      : true
        }
    ]
})
export class SelectionComponent implements OnInit, ControlValueAccessor {
    @Input()
    get steps() : ISelectTalents[] {
        return this._steps;
    }
    
    set steps(value : ISelectTalents[]) {
        this._steps = !value || value.length === 0 ? undefined : value;
        this.step = 0;
        while(this.form.length) {
            this.form.removeAt(0);
        }
        if(value) {
            for(const t of value) {
                this.form.push(new FormArray(t.values.map(() => new FormControl(null, Validators.required))));
            }
        }
    }
    
    protected _steps? : ISelectTalents[];
    
    @HostBinding("attr.style")
    get columns() {
        return this.sanitizer.bypassSecurityTrustStyle(`--columns: ${this.steps ? this.steps[ this.step ].values.length : 0}`);
    }
    
    @ViewChild('submit')
    submitButton : ElementRef<HTMLButtonElement>;
    
    step = 0;
    
    form = new FormArray([]);
    
    subscription = Subscription.EMPTY;
    
    constructor(protected readonly sanitizer : DomSanitizer) {
    }
    
    ngOnInit() {
    }
    
    submit() {
        this.submitButton.nativeElement.click();
        if(this.form.at(this.step).invalid) {
            return;
        }
        if(this.step + 1 < this.steps.length) {
            ++this.step;
        }
    }
    
    registerOnChange(fn : any) : void {
        this.subscription.unsubscribe();
        this.subscription = combineLatest(
            this.form.statusChanges,
            this.form.valueChanges
        )
            .pipe(startWith([ this.form.status, this.form.value ]))
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
        if(obj) {
            this.form.patchValue(obj);
        } else {
            this.form.reset();
        }
    }
    
}
