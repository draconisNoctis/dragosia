import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators, ControlValueAccessor } from '@angular/forms';
import { IAdvantage, IDisadvantage, Presets, IAdvantageDisadvantageDetails } from '@jina-draicana/presets';

import { AbstractComponent } from '../abstract.component';

const CUSTOM_REGEXP = /^(.*)\s*\((\d+)\)$/;

export class SelectAdvantageEvent {
    constructor(public readonly type : 'advantage' | 'disadvantage',
                public readonly value : IAdvantage & (IAdvantageDisadvantageDetails | IAdvantageDisadvantageDetails),
                public readonly costs : number) {}
}

@Component({
    selector: 'js-advantages',
    templateUrl: './advantages.component.html',
    styleUrls: ['./advantages.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['mode'],
    host: {
        'class': 'js-advantages mat-typography',
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: AdvantagesComponent,
        multi: true
    }]
})
export class AdvantagesComponent implements ControlValueAccessor {
    @Input()
    set preset(preset: string) {
        this.availableAdvantages = this.presets.getAdvantagesForPreset(preset);
        this.availableDisadvantages = this.presets.getDisadvantagesForPreset(preset);
        this.availableAdvantagesMap = new Map(this.availableAdvantages.map(a => [ a.name, a ] as [string, IAdvantage & IAdvantageDisadvantageDetails]));
        this.availableDisadvantagesMap = new Map(this.availableDisadvantages.map(d => [ d.name, d ] as [string, IDisadvantage & IAdvantageDisadvantageDetails]));
    }

    @Input()
    budget = Infinity;

    @Output()
    select = new EventEmitter<SelectAdvantageEvent>();


    availableAdvantages?: (IAdvantage & IAdvantageDisadvantageDetails)[];
    availableDisadvantages?: (IDisadvantage & IAdvantageDisadvantageDetails)[];
    availableAdvantagesMap?: Map<string, IAdvantage & IAdvantageDisadvantageDetails>;
    availableDisadvantagesMap?: Map<string, IAdvantage & IAdvantageDisadvantageDetails>;

    advantages: IAdvantage[] = [];
    disadvantages: IDisadvantage[] = [];

    customAdvantageControl = new FormGroup({
        name: new FormControl(null, Validators.required),
        specialization: new FormControl(null),
        value: new FormControl(null, Validators.required)
    });

    customDisadvantageControl = new FormGroup({
        name: new FormControl(null, Validators.required),
        specialization: new FormControl(null),
        value: new FormControl(null, Validators.required)
    });

    onChange : any = () => {};

    constructor(protected readonly presets: Presets,
        protected readonly cdr: ChangeDetectorRef) {
    }

    addAdvantage(advantage?: IAdvantage & IAdvantageDisadvantageDetails, noEmit?: boolean) {
        if(advantage.multi && !advantage.specialization) {
            advantage = {
                ...advantage,
                specialization: this.getFormControl(advantage.name).value
            };
            this.getFormControl(advantage.name).reset();
        }

        this.advantages.push(advantage);
        !noEmit && this.select.emit(new SelectAdvantageEvent('advantage', advantage, advantage.value));
        this.onChange({ advantages: this.advantages, disadvantages: this.disadvantages });
    }

    addDisadvantage(disadvantage?: IDisadvantage & IAdvantageDisadvantageDetails, noEmit?: boolean) {
        if(disadvantage.multi && !disadvantage.specialization) {
            disadvantage = {
                ...disadvantage,
                specialization: this.getFormControl(disadvantage.name).value
            }
            this.getFormControl(disadvantage.name).reset();
        }
        this.disadvantages.push(disadvantage);
        !noEmit && this.select.emit(new SelectAdvantageEvent('disadvantage', disadvantage, disadvantage.value));
        this.onChange({ advantages: this.advantages, disadvantages: this.disadvantages });
    }

    forms = new Map<string, FormControl>();
    getFormControl(name : string) {
        if(!this.forms.has(name)) {
            this.forms.set(name, new FormControl(null, Validators.required));
        }

        return this.forms.get(name);
    }

    hasAdvantage(name : string) {
        return this.advantages.some(a => a.name === name);
    }

    hasDisadvantage(name : string) {
        return this.disadvantages.some(d => d.name === name);
    }

    removeAdvantage(index: number) {
        this.advantages.splice(index, 1);
        this.onChange({ advantages: this.advantages, disadvantages: this.disadvantages });
    }

    removeDisadvantage(index: number) {
        this.disadvantages.splice(index, 1);
        this.onChange({ advantages: this.advantages, disadvantages: this.disadvantages });
    }

    writeValue(obj: null | { advantages: IAdvantage[], disadvantages: IDisadvantage[] }): void {
        this.advantages.length = 0;
        this.disadvantages.length = 0;

        if (obj) {
            for (const advantage of obj.advantages) {
                this.addAdvantage({ ...this.availableAdvantagesMap.get(advantage.name), ...advantage }, true);
            }

            for (const disadvantage of obj.disadvantages) {
                this.addDisadvantage({ ...this.availableDisadvantagesMap.get(disadvantage.name), ...disadvantage }, true);
            }
        }

        this.cdr.markForCheck();
    }

    registerOnChange(fn : any) {
        this.onChange = fn;
    }

    registerOnTouched() {

    }
}
