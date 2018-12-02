import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
        mana: new FormControl()
    });
    
    
    constructor() {
    }
    
    ngOnInit() {
        this.form.valueChanges.subscribe(value => {
            console.log(value);
        })
    }
    
}
