import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Optional,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { ICulture, IProfession, IRace, Presets } from '@jina-draicana/presets';
import { combineLatest, Subscription } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
    selector       : 'cs-background',
    templateUrl    : './background.component.html',
    styleUrls      : [ './background.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'cs-background'
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: BackgroundComponent,
            multi: true
        }
    ]
})
export class BackgroundComponent implements OnInit, ControlValueAccessor {
    @Input()
    set preset(preset : string) {
        this.races = this.presets.getRacesForPreset(preset);
    }
    
    @Output()
    next = new EventEmitter<void>();
    
    races?: IRace[];
    cultures?: ICulture[];
    professions?: IProfession[];
    
    form = new FormGroup({
        race: new FormControl(null, Validators.required),
        culture: new FormControl({ disabled: true }, Validators.required),
        profession: new FormControl({ disabled: true }, Validators.required)
    });
    
    subscription = Subscription.EMPTY;
    
    constructor(protected readonly presets : Presets) {
    }
    
    ngOnInit() {
        const race = this.form.get('race')!;
        const culture = this.form.get('culture')!;
        const profession = this.form.get('profession')!;
        
        race.valueChanges.pipe(
            startWith(race.value)
        ).subscribe(value => {
            if(value) {
                culture.enable();
                this.cultures = this.presets.getCulturesForRace(value);
    
                if(!this.cultures.some(c => c.id === culture.value)) {
                    culture.reset();
                }
            } else {
                culture.disable();
                this.cultures = undefined;
            }
        });
        
        culture.valueChanges.pipe(
            startWith(culture.value)
        ).subscribe(value => {
            if(value) {
                profession.enable();
                this.professions = this.presets.getProfessionsForCulture(value);
    
                if(!this.professions.some(p => p.id === profession.value)) {
                    profession.reset();
                }
            } else {
                profession.disable();
                this.professions = undefined;
            }
        });
    }
    
    registerOnChange(fn: any): void {
        this.subscription.unsubscribe();
        this.subscription = combineLatest(
            this.form.statusChanges,
            this.form.valueChanges
        )
            .pipe(startWith([this.form.status, this.form.value]), debounceTime(1))
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
    
    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }
    
    writeValue(obj: any): void {
        if (obj) {
            this.form.patchValue(obj);
        }
    }
    
}
