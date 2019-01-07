import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { IAdvantage, IDisadvantage, Presets } from '@jina-draicana/presets';
import { AbstractComponent } from '../abstract.component';

@Component({
    selector       : 'js-advantages',
    templateUrl    : './advantages.component.html',
    styleUrls      : [ './advantages.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs         : [ 'pointsAvailable' ],
    outputs        : [ 'pointsAvailableChange' ],
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
    
    advantages? : IAdvantage[];
    disadvantages? : IDisadvantage[];
    
    advantageControl = new FormControl(null, Validators.required);
    disadvantageControl = new FormControl(null, Validators.required);
    
    advantagesForm = new FormArray([]);
    disadvantagesForm = new FormArray([]);
    
    form = new FormGroup({
        advantages   : this.advantagesForm,
        disadvantages: this.disadvantagesForm
    });
    
    constructor(protected readonly presets : Presets) {
        super();
    }
    
    protected calculatePrice(previous : any, current : any) : number {
        let price = 0;
        for(const advantage of current.advantages) {
            price -= advantage.value;
        }
        for(const disadvantage of current.disadvantages) {
            price += disadvantage.value;
        }
        
        this.pointsAvailable = price;
        this.pointsAvailableChange.emit(price);
        
        return 0;
    }
    
    protected transformValue(value : any) : any {
        return {
            advantages: value.advantages.map(a => a.name).join(', '),
            disadvantages: value.disadvantages.map(d => d.name).join(', ')
        }
    }
    
    addAdvantage(advantage : IAdvantage) {
        const control = new FormControl(advantage);
        this.advantagesForm.push(control);
    }
    
    addDisadvantage(disadvantage : IDisadvantage) {
        const control = new FormControl(disadvantage);
        this.disadvantagesForm.push(control);
    }
    
    removeAdvantage(index : number) {
        this.advantagesForm.removeAt(index);
        this.form.updateValueAndValidity();
    }
    
    removeDisadvantage(index : number) {
        this.disadvantagesForm.removeAt(index);
        this.form.updateValueAndValidity();
    }
    
    writeValue(obj : any) : void {
        this.unregisterSubscriptions();
        while(this.advantagesForm.length) {
            this.advantagesForm.removeAt(0);
        }
        while(this.disadvantagesForm.length) {
            this.disadvantagesForm.removeAt(0);
        }
        
        for(const advantage of obj.advantages.trim().split(/\s*,\s*/).filter(Boolean)) {
            this.addAdvantage(this.advantages.find(a => a.name === advantage) || { name: advantage, value: 0 });
        }
        
        for(const disadvantage of obj.disadvantages.trim().split(/\s*,\s*/).filter(Boolean)) {
            this.addDisadvantage(this.disadvantages.find(d => d.name === disadvantage) || { name: disadvantage, value: 0 });
        }
        
        this.form.updateValueAndValidity();
        this.registerSubscription();
    }
}
