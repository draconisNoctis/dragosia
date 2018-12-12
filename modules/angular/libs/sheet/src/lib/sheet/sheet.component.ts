import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector       : 'js-sheet',
    templateUrl    : './sheet.component.html',
    styleUrls      : [ './sheet.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'js-sheet'
    }
})
export class SheetComponent implements OnInit {
    form = new FormGroup({
        about: new FormGroup({
            name: new FormControl(null, Validators.required),
            race: new FormControl(null, Validators.required),
            culture: new FormControl(null, Validators.required),
            class: new FormControl(null, Validators.required),
            description: new FormControl(null, Validators.required)
        }),
        attributes: new FormGroup({
            strength: new FormControl(null, Validators.required),
            agility: new FormControl(null, Validators.required),
            dexterity: new FormControl(null, Validators.required),
            constitution: new FormControl(null, Validators.required),
            courage: new FormControl(null, Validators.required),
            intelligence: new FormControl(null, Validators.required),
            intuition: new FormControl(null, Validators.required),
            charisma: new FormControl(null, Validators.required)
        }),
        skills: new FormGroup({
            melee: new FormControl(null, Validators.required),
            range: new FormControl(null, Validators.required),
            physical: new FormControl(null, Validators.required),
            mental: new FormControl(null, Validators.required),
            magic: new FormControl(null, Validators.required)
        }),
        advantages: new FormControl(),
        disadvantages: new FormControl(),
        health: new FormControl(),
        mana: new FormControl(),
        
        talents: new FormGroup({
            melee: new FormArray(Array.from({ length: 8 }, () => this.createTalentFormControl())),
            range: new FormArray(Array.from({ length: 8 }, () => this.createTalentFormControl())),
            physical: new FormArray(Array.from({ length: 13 }, () => this.createTalentFormControl())),
            mental: new FormArray(Array.from({ length: 13 }, () => this.createTalentFormControl())),
            magic: new FormArray(Array.from({ length: 16 }, () => this.createTalentFormControl()))
        }),
        
        inventory: new FormControl(),
        financials: new FormControl(),
        equipment: new FormControl(),
        
        melee: new FormArray(Array.from({ length: 8 }, () => this.createMeleeWeaponControl())),
        range: new FormArray(Array.from({ length: 8 }, () => this.createRangeWeaponControl()))
    });
    
    
    constructor() {
    }
    
    ngOnInit() {
        this.form.valueChanges.subscribe(value => {
            console.log(value);
        })
    }
    
    protected createTalentFormControl() {
        return new FormGroup({
            skill: new FormControl(),
            name: new FormControl(),
            attribute: new FormControl(),
            value: new FormControl()
        })
    }
    
    protected createMeleeWeaponControl() {
        return new FormGroup({
            name: new FormControl(),
            type: new FormControl(),
            attribute: new FormControl(),
            attackModificator: new FormControl(),
            paradeModificator: new FormControl(),
            damageModificator: new FormControl()
        })
    }
    
    protected createRangeWeaponControl() {
        return new FormGroup({
            name: new FormControl(),
            type: new FormControl(),
            attribute: new FormControl(),
            range: new FormControl(),
            paradeModificator: new FormControl(),
            damageModificator: new FormControl()
        })
    }
}
