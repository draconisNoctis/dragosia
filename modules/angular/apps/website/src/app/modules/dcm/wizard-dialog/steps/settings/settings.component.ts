import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { IPreset, Presets } from '@jina-draicana/presets';
import { combineLatest, Subscription } from 'rxjs';
import { delay, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

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
    submitButton: ElementRef<HTMLButtonElement>;

    form = new FormGroup({
        preset: new FormControl(null, Validators.required),
        budget: new FormControl('normal'),
        points: new FormGroup({
            points: new FormControl(null, Validators.required),
            attributes: new FormGroup({
                min: new FormControl(null, Validators.required),
                max: new FormControl(null, Validators.required)
            }),
            gifts: new FormGroup({
                min: new FormControl(null, Validators.required),
                max: new FormControl(null, Validators.required)
            }),
            talents: new FormGroup({
                min: new FormControl(null, Validators.required),
                max: new FormControl(null, Validators.required)
            })
        })
    });

    subscription = Subscription.EMPTY;

    presets: IPreset[];

    constructor(presets: Presets) {
        this.presets = presets.getPresets();
    }

    ngOnInit() {
        const points = this.form.get('points')!;

        this.form.get('budget')!.valueChanges
            .pipe(startWith(this.form.get('budget')!.value), delay(1))
            .subscribe(value => {
                if (value === 'custom') {
                    if (points.disabled) {
                        points.enable({ emitEvent: false });
                    }
                } else {
                    if (points.enabled) {
                        points.disable({ emitEvent: false });
                    }
                    switch (value) {
                        case 'beginner':
                            points.reset({
                                points: 7000,
                                attributes: {
                                    min: 6000,
                                    max: 13
                                },
                                gifts: {
                                    min: 0,
                                    max: 10
                                },
                                talents: {
                                    min: 0,
                                    max: 10
                                }
                            });
                            break;
                        case 'normal':
                            points.reset({
                                points: 8000,
                                attributes: {
                                    min: 6500,
                                    max: 14
                                },
                                gifts: {
                                    min: 0,
                                    max: 12
                                },
                                talents: {
                                    min: 0,
                                    max: 12
                                }
                            });
                            break;
                        case 'hero':
                            points.reset({
                                points: 9000,
                                attributes: {
                                    min: 7000,
                                    max: 15
                                },
                                gifts: {
                                    min: 0,
                                    max: 14
                                },
                                talents: {
                                    min: 0,
                                    max: 14
                                }
                            });
                            break;
                        case 'legend':
                            points.reset({
                                points: 10000,
                                attributes: {
                                    min: 8000,
                                    max: 16
                                },
                                gifts: {
                                    min: 0,
                                    max: 16
                                },
                                talents: {
                                    min: 0,
                                    max: 16
                                }
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
        ).pipe(
            map(([status, value]) => status === 'VALID' ? value : null),
            distinctUntilChanged(),
            tap(fn)
        ).subscribe()
    }

    registerOnTouched(fn: any): void {
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
        } else {
            this.form.reset();
        }
    }
}
