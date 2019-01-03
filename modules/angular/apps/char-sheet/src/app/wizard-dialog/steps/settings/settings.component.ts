import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    FormGroupDirective,
    NG_VALUE_ACCESSOR,
    NgForm,
    Validators
} from '@angular/forms';
import { IPreset, Presets } from '@jina-draicana/presets';
import { combineLatest, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'cs-settings',
    exportAs: 'csSettings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'cs-settings'
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SettingsComponent,
            multi: true
        }
    ]
})
export class SettingsComponent implements OnInit, ControlValueAccessor {
    @ViewChild('submit')
    submitButton : ElementRef<HTMLButtonElement>;
    
    form = new FormGroup({
        preset: new FormControl(null, Validators.required),
        budget: new FormGroup({
            attributes: new FormControl(null, Validators.required),
            skills: new FormControl(null, Validators.required),
            talents: new FormControl(null, Validators.required)
        })
    });

    budgetControl = new FormControl('normal');

    subscription = Subscription.EMPTY;
    
    presets : IPreset[];

    constructor(presets : Presets) {
        this.presets = presets.getPresets();
    }

    ngOnInit() {
        const budget = this.form.get('budget')!;

        this.budgetControl.valueChanges
            .pipe(startWith(this.budgetControl.value))
            .subscribe(value => {
                if (value === 'custom') {
                    if (budget.disabled) {
                        budget.enable();
                    }
                } else {
                    if (budget.enabled) {
                        budget.disable();
                    }
                    switch (value) {
                        case 'beginner':
                            budget.setValue({
                                attributes: 4,
                                skills: 5,
                                talents: 40
                            });
                            break;
                        case 'normal':
                            budget.setValue({
                                attributes: 12,
                                skills: 9,
                                talents: 60
                            });
                            break;
                        case 'hero':
                            budget.setValue({
                                attributes: 22,
                                skills: 18,
                                talents: 80
                            });
                            break;
                        case 'legend':
                            budget.setValue({
                                attributes: 32,
                                skills: 25,
                                talents: 100
                            });
                            break;
                    }
                }
            });
    }
    
    submit() {
        this.submitButton.nativeElement.click();
    }

    registerOnChange(fn: any): void {
        this.subscription.unsubscribe();
        this.subscription = combineLatest(
            this.form.statusChanges,
            this.form.valueChanges.pipe(map(() => this.form.getRawValue()))
        )
            .pipe(startWith([this.form.status, this.form.getRawValue()]))
            .subscribe(([status, value]) => {
                if ('VALID' === status) {
                    fn(value);
                }
            });
    }

    registerOnTouched(fn: any): void {}

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
