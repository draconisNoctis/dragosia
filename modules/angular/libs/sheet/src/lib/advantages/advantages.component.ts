import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { IAdvantage, IDisadvantage, Presets } from '@jina-draicana/presets';

import { AbstractComponent } from '../abstract.component';

const CUSTOM_REGEXP = /^(.*)\s*\((\d+)\)$/;

@Component({
    selector       : 'js-advantages',
    templateUrl    : './advantages.component.html',
    styleUrls      : [ './advantages.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'js-advantages mat-typography',
    },
    providers      : [ {
        provide    : NG_VALUE_ACCESSOR,
        useExisting: AdvantagesComponent,
        multi      : true
    } ]
})
export class AdvantagesComponent extends AbstractComponent {
    @Input()
    set preset(preset : string) {
        this.advantages = this.presets.getAdvantagesForPreset(preset);
        this.disadvantages = this.presets.getDisadvantagesForPreset(preset);
    }

    @Input()
    budget = Infinity;


    advantages? : IAdvantage[];
    disadvantages? : IDisadvantage[];

    customAdvantageControl = new FormGroup({
        name: new FormControl(null, Validators.required),
        value: new FormControl(null, [ Validators.required, ({ value}) => {
            if(null != value && value > this.budget) {
                return { overbudget: { budget: this.budget } }
            }
            return null;
        }])
    });

    customDisadvantageControl = new FormGroup({
        name: new FormControl(null, Validators.required),
        value: new FormControl(null, Validators.required)
    });

    advantageForm = new FormGroup({
        advantage: new FormControl(null, [ Validators.required, ({ value }) => {
            if(null != value && value.value > this.budget) {
                return { overbudget: { budget: this.budget } };
            }
            return null;
        }]),
        specialization: new FormControl(null)
    });
    disadvantageForm = new FormGroup({
        disadvantage: new FormControl(null, Validators.required),
        specialization: new FormControl(null)
    });

    advantagesForm = new FormArray([]);
    disadvantagesForm = new FormArray([]);

    form = new FormGroup({
        advantages   : this.advantagesForm,
        disadvantages: this.disadvantagesForm
    });

    constructor(protected readonly presets : Presets) {
        super();
    }

    addAdvantage(advantage?: IAdvantage) {
        if(!advantage) {
            if(this.advantageForm.value.advantage === 'custom') {
                advantage = {
                    name: this.customAdvantageControl.value.name,
                    specialization: this.advantageForm.value.specialization || undefined,
                    value: this.customAdvantageControl.value.value,
                    custom: true
                }
            } else {
                advantage = {
                    ...this.advantageForm.value.advantage,
                    specialization: this.advantageForm.value.specialization || undefined
                } as IAdvantage
            }
        }
        const control = new FormControl(advantage);
        this.advantagesForm.push(control);
        this.advantageForm.reset();
        this.customAdvantageControl.reset();
    }

    addDisadvantage(disadvantage?: IDisadvantage) {
        if(!disadvantage) {
            if(this.disadvantageForm.value.disadvantage === 'custom') {
                disadvantage = {
                    name: this.customDisadvantageControl.value.name,
                    specialization: this.disadvantageForm.value.specialization || undefined,
                    value: this.customDisadvantageControl.value.value,
                    custom: true
                }
            } else {
                disadvantage = {
                    ...this.disadvantageForm.value.disadvantage,
                    specialization: this.disadvantageForm.value.specialization || undefined
                } as IDisadvantage
            }
        }
        const control = new FormControl(disadvantage);
        this.disadvantagesForm.push(control);
        this.disadvantageForm.reset();
        this.customDisadvantageControl.reset();
    }

    removeAdvantage(index : number) {
        this.advantagesForm.removeAt(index);
        this.form.updateValueAndValidity();
    }

    removeDisadvantage(index : number) {
        this.disadvantagesForm.removeAt(index);
        this.form.updateValueAndValidity();
    }

    writeValue(obj : null|{ advantages: IAdvantage[], disadvantages: IDisadvantage[] }) : void {
        this.unregisterSubscriptions();
        while(this.advantagesForm.length) {
            this.advantagesForm.removeAt(0);
        }
        while(this.disadvantagesForm.length) {
            this.disadvantagesForm.removeAt(0);
        }

        if(obj) {
            for(const advantage of obj.advantages) {
                this.addAdvantage(advantage);
            }

            for(const disadvantage of obj.disadvantages) {
                this.addDisadvantage(disadvantage);
            }
            this.form.updateValueAndValidity();
        }

        this.registerSubscription();
    }
}
