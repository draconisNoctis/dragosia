import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { getCosts } from '@jina-draicana/presets';
import { AbstractComponent } from '../abstract.component';

@Component({
    selector       : 'js-skills',
    templateUrl    : './skills.component.html',
    styleUrls      : [ './skills.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: [ 'pointsAvailable', 'mode', 'factor' ],
    outputs: [ 'pointsAvailableChange' ],
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
    
    writeValue(obj : any) : void {
        this.unregisterSubscriptions();
        if(obj) {
            this.form.setValue(obj, { emitEvent: false });
            this.mins = obj;
        }
        this.registerSubscription();
    }
    
    add(type : string) {
        const control = this.form.get(type)!;
        control.setValue(control.value + 1);
    }
    
    protected calculatePrice(previous : any, current : any) : number {
        let price = 0;
        for(const key in previous) {
            price += getCosts(previous[key], current[key]);
        }
        
        return price;
    }
    
}
