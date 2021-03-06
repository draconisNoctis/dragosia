import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Output, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICharacter } from '@jina-draicana/presets';
import { ArmorService } from '../armor/armor.service';

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
export class SheetComponent {

    form = new FormGroup({
        _id: new FormControl((Math.random() * 1000000 | 0).toString(36)),
        about: new FormGroup({
            name: new FormControl(null, Validators.required),
            race: new FormControl(null, Validators.required),
            culture: new FormControl(null, Validators.required),
            profession: new FormControl(null, Validators.required),
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
            social: new FormControl(null, Validators.required)
        }),
        gifts: new FormArray(Array.from({ length: 4 }, () => this.createGiftFormControl())),
        advantages: new FormControl(),
        disadvantages: new FormControl(),
        health: new FormControl(),
        mana: new FormControl(),

        talents: new FormGroup({
            melee: new FormArray(Array.from({ length: 8 }, () => this.createTalentFormControl())),
            range: new FormArray(Array.from({ length: 8 }, () => this.createTalentFormControl())),
            physical: new FormArray(Array.from({ length: 18 }, () => this.createTalentFormControl())),
            mental: new FormArray(Array.from({ length: 18 }, () => this.createTalentFormControl())),
            social: new FormArray(Array.from({ length: 10 }, () => this.createTalentFormControl())),
            gifts: new FormArray(Array.from({ length: 10 }, () => this.createTalentFormControl()))
        }),

        inventory: new FormControl(),
        financials: new FormControl(),
        equipment: new FormControl(),

        melee: new FormArray(Array.from({ length: 8 }, () => this.createMeleeWeaponControl())),
        range: new FormArray(Array.from({ length: 8 }, () => this.createRangeWeaponControl())),

        meta: new FormGroup({
            preset: new FormControl(),
            budget: new FormGroup({
                attributes: new FormControl(),
                skills: new FormControl(),
                talents: new FormControl()
            }),
            exp: new FormGroup({
                spend: new FormControl(),
                total: new FormControl()
            })
        })
    });

    giftsForm = this.form.get('gifts') as FormArray;
    meleeForm = this.form.get('melee') as FormArray;
    rangeForm = this.form.get('range') as FormArray;

    talentsMeleeForm = this.form.get([ 'talents', 'melee' ]) as FormArray;
    talentsRangeForm = this.form.get([ 'talents', 'range' ]) as FormArray;
    talentsPhysicalForm = this.form.get([ 'talents', 'physical' ]) as FormArray;
    talentsMentalForm = this.form.get([ 'talents', 'mental' ]) as FormArray;
    talentsSocialForm = this.form.get([ 'talents', 'social' ]) as FormArray;
    talentsGiftsForm = this.form.get([ 'talents', 'gifts' ]) as FormArray;

    get armor() {
        if(!this._character) {
            return null;
        }

        return this.armorService.aggregateArmor(this._character.armor);
    }

    get armorSummary() {
        if(!this._character) {
            return null;
        }

        return this.armorService.getTotalArmor(this.armor!);
    }

    @Input()
    set character(char : ICharacter) {
        console.log(char);
        if(char) {
            this.form.patchValue(char, { emitEvent: false });
        }
        this._character = char;
    }
    get character() {
        return this._character!;
    }
    protected _character?: ICharacter;

    @Output()
    update = this.form.valueChanges;

    constructor(protected readonly armorService : ArmorService) {
    }

    protected createGiftFormControl() {
        return new FormGroup({
            name: new FormControl(),
            level: new FormControl(),
            value: new FormControl()
        })
    }

    protected createTalentFormControl() {
        return new FormGroup({
            skill: new FormControl(),
            name: new FormControl(),
            attributes: new FormControl([
                new FormControl(),
                new FormControl()
            ]),
            gift: new FormControl(),
            value: new FormControl(),
            level: new FormControl()
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
            attackModificator: new FormControl(),
            damageModificator: new FormControl()
        })
    }
}
