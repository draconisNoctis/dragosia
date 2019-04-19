import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { AbstractComponent } from '../abstract.component';
import { RaiseService } from '../raise/raise.service';

@Component({
    selector       : 'js-skills',
    templateUrl    : './skills.component.html',
    styleUrls      : [ './skills.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: [ 'mode' ],
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
export class SkillsComponent extends AbstractComponent implements ControlValueAccessor {
    @Input()
    max = Infinity;

    @Input()
    budget = Infinity;

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

    constructor(protected readonly raiseService: RaiseService) {
        super();
    }

    writeValue(obj : any) : void {
        this.unregisterSubscriptions();
        if(obj) {
            this.form.setValue(obj, { emitEvent: false });
            this.mins = obj;
        } else {
            this.form.reset(undefined, { emitEvent: false });
        }
        this.registerSubscription();
    }

    add(type : string) {
        const control = this.form.get(type)!;
        control.setValue(control.value + 1);
    }

    remove(type: string) {
        const control = this.form.get(type)!;
        control.setValue(control.value - 1);
    }

    getCostsForNext(type: string) {
        const control = this.form.get(type)!;

        return this.raiseService.getRaiseCosts(control.value + 1, 'F');
    }
}
