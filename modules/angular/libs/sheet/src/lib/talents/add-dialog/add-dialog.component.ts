import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ICharacterTalents, IGift, IPartialTalent, ITalent, ICharacterTalent } from '@jina-draicana/presets';
import { map, startWith } from 'rxjs/operators';

import { Level, RaiseService } from '../../raise/raise.service';

@Component({
    selector: 'js-add-dialog',
    templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'js-add-dialog mat-typography'
    }
})
export class AddDialogComponent {
    talents: IPartialTalent[];
    gifts: IGift[];
    budget: number;

    filter = new FormControl(null);

    isList = this.filter.valueChanges.pipe(
        startWith(''),
        map(value => !value || value.type !== 'custom')
    );

    isCustomSkillTalent = this.filter.valueChanges.pipe(
        startWith(''),
        map(value => value && value.type === 'custom' && value.category)
    );

    isCustomGiftTalent = this.filter.valueChanges.pipe(
        startWith(''),
        map(value => value && value.type === 'custom' && value.gift)
    );

    customTalentControl = new FormGroup({
        name: new FormControl(null, Validators.required),
        attribute1: new FormControl(null, Validators.required),
        attribute2: new FormControl(null, Validators.required),
        level: new FormControl(null, [Validators.required, ({ value }) => {
            if (value != null && this.getCosts(value) > this.budget) {
                return { overbudget: true }
            }
            return null;
        }])
    });

    customGiftTalentControl = new FormGroup({
        name: new FormControl(null, Validators.required),
        attribute: new FormControl(null, Validators.required),
        level: new FormControl(null, [Validators.required, ({ value }) => {
            if (value != null && this.getCosts(value) > this.budget) {
                return { overbudget: true }
            }
            return null;
        }])
    });

    filteredTalents = this.filter.valueChanges.pipe(
        startWith(this.filter.value),
        map(value => {
            if (!value) {
                return this.talents;
            }
            if (value.type === 'gift') {
                return this.talents.filter(t => t.gift === value.gift);
            }
            return this.talents.filter(t => t.category === value.category);
        })
    );

    constructor(@Inject(MAT_DIALOG_DATA) data: { talents: IPartialTalent[], gifts: IGift[], budget: number },
        protected readonly ref: MatDialogRef<AddDialogComponent>,
        protected readonly raiseService: RaiseService) {
        this.talents = data.talents;
        this.talents.sort((a, b) => a.name.localeCompare(b.name));
        this.gifts = data.gifts;
        this.budget = data.budget;
    }

    getCosts(level: Level) {
        return this.raiseService.getRaiseCosts(1, level);
    }

    submit(talent: IPartialTalent) {
        const result: ICharacterTalent & { category: keyof ICharacterTalents } = {
            ...talent,
            value: 1
        };
        this.ref.close(result);
    }

    submitCustomSkillTalent() {
        const { name, attribute1, attribute2, level } = this.customTalentControl.value;
        const talent: ICharacterTalent & { category: keyof ICharacterTalents } = {
            name: name,
            category: this.filter.value.category,
            attributes: [ attribute1, attribute2 ],
            level: level,
            value: 1
        }
        this.ref.close(talent);
    }

    submitCustomGiftTalent() {
        const { name, attribute, level } = this.customGiftTalentControl.value;
        const talent: ICharacterTalent & { category: keyof ICharacterTalents } = {
            name: name,
            category: 'gifts',
            attributes: [ this.filter.value.gift, attribute ],
            level: level,
            value: 1
        }
        this.ref.close(talent);
    }
}
