import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { AbstractComponent } from '../abstract.component';
import { RaiseService } from '../raise/raise.service';
import { ICharacterAttributes } from '@jina-draicana/presets';

export class IncreaseAttributeEvent {
    constructor(public readonly attribute : keyof ICharacterAttributes,
                public readonly value : number,
                public readonly costs : number) {}
}

@Component({
    selector: 'js-attributes',
    templateUrl: './attributes.component.html',
    styleUrls: ['./attributes.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['mode'],
    host: {
        'class': 'js-attributes mat-typography',
        '[class.js-attributes-button]': 'mode === "button"',
        '[class.js-attributes-range]': 'mode === "range"'
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: AttributesComponent,
        multi: true
    }]
})
export class AttributesComponent extends AbstractComponent implements ControlValueAccessor {
    @Input()
    max = Infinity;

    @Input()
    budget = Infinity;

    @Output()
    increase = new EventEmitter<IncreaseAttributeEvent>();

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

    constructor(protected readonly raiseService: RaiseService,
            protected readonly cdr : ChangeDetectorRef) {
        super();
    }

    writeValue(obj: any): void {
        this.unregisterSubscriptions();
        if (obj) {
            this.mins = obj;
            this.form.setValue(obj, { emitEvent: false });
        } else {
            this.form.reset(undefined, { emitEvent: false });
        }
        this.registerSubscription();
        this.cdr.markForCheck();
    }

    add(type: string) {
        const control = this.form.get(type)!;
        this.increase.emit(new IncreaseAttributeEvent(type as keyof ICharacterAttributes, control.value + 1, this.getCostsForNext(type)));
        control.setValue(control.value + 1);
    }

    remove(type: string) {
        const control = this.form.get(type)!;
        control.setValue(control.value - 1);
    }

    getCostsForNext(type: string) {
        const control = this.form.get(type)!;

        return this.raiseService.getRaiseCosts(control.value + 1, 'E');
    }
}
