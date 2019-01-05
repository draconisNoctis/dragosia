import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { getCosts } from '@jina-draicana/presets';
import { AbstractComponent } from '../abstract.component';

@Component({
    selector       : 'js-attributes',
    templateUrl    : './attributes.component.html',
    styleUrls      : [ './attributes.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: [ 'pointsAvailable', 'mode', 'factor' ],
    outputs: [ 'pointsAvailableChange' ],
    host           : {
        'class': 'js-attributes mat-typography',
        '[class.js-attributes-button]': 'mode === "button"',
        '[class.js-attributes-range]': 'mode === "range"'
    },
    providers      : [ {
        provide    : NG_VALUE_ACCESSOR,
        useExisting: AttributesComponent,
        multi      : true
    } ]
})
export class AttributesComponent extends AbstractComponent implements ControlValueAccessor {
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
    
    writeValue(obj : any) : void {
        this.unregisterSubscriptions();
        if(obj) {
            this.mins = obj;
            this.form.setValue(obj, { emitEvent: false });
        }
        this.registerSubscription();
    }
    
    add(type : string) {
        const control = this.form.get(type)!;
        control.setValue(control.value + 1);
    }
    
    protected calculatePrice(previous : any, current : any) : number {
        let price = 0;
        for(const key in current) {
            price += getCosts(previous[key], current[key]);
        }
        
        return price;
    }
    
}
