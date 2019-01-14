import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatHorizontalStepper } from '@angular/material';
import {
    applyPartials,
    createEmptyCharacter,
    getPartialSelections,
    ICharacter,
    ICosts,
    ISelectTalents,
    Presets
} from '@jina-draicana/presets';
import { FACTOR_ATTRIBUTES, FACTOR_SKILLS, FACTOR_TALENTS } from '@jina-draicana/sheet';
import { delay, filter } from 'rxjs/operators';

@Component({
    selector       : 'cs-wizard-dialog',
    templateUrl    : './wizard-dialog.component.html',
    styleUrls      : [ './wizard-dialog.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'cs-wizard-dialog mat-typography'
    }
})
export class WizardDialogComponent {
    settingsControl = new FormControl(null, Validators.required);
    backgroundControl = new FormControl(null, Validators.required);
    selectionsControl = new FormControl({ value: null, disabled: true }, Validators.required);
    attributesControl = new FormControl(null, Validators.required);
    skillsGiftsControl = new FormGroup({
        skills: new FormControl(null),
        gifts : new FormControl(null)
    });
    talentsControl = new FormControl(null, Validators.required);
    advantagesControl = new FormControl(null, Validators.required);
    
    character? : ICharacter;
    costs? : ICosts;
    budget? : ICosts;
    
    selections? : ISelectTalents[];
    
    @ViewChild(MatHorizontalStepper)
    stepper! : MatHorizontalStepper;
    
    stepperIndex = 0;
    
    constructor(protected readonly presets : Presets,
                protected readonly ref : MatDialogRef<WizardDialogComponent>) {
    }
    
    nextAfterBackground() {
        this.stepper.next();
        if(this.selections.length === 0) {
            this.stepper.next();
        }
    }
    
    create() {
        this.character.attributes = this.attributesControl.value;
        this.character.skills = this.skillsGiftsControl.value.skills;
        this.character.gifts = this.skillsGiftsControl.value.gifts;
        this.character.talents = this.talentsControl.value;
        this.character.advantages = this.advantagesControl.value.advantages;
        this.character.disadvantages = this.advantagesControl.value.disadvantages;
        
        this.character.meta.exp.spend = this.costs.attributes * 4 + this.costs.skills * 2 + this.costs.talents;
        this.character.meta.exp.total = this.character.meta.exp.spend + this.budget.talents;
        
        console.log(this.character);
        this.ref.close(this.character);
    }
    
    stepperChange(event : StepperSelectionEvent) {
        this.stepperIndex = event.selectedIndex;
    
        switch(this.stepperIndex) {
            case 0: {
                this.settingsControl.reset();
                break;
            }
            case 2: {
                const value = this.backgroundControl.value;
                const selections = getPartialSelections([
                    this.presets.getRacesForPreset(this.settingsControl.value.preset).find(r => r.id === value.race)!,
                    this.presets.getCulturesForRace(value.race).find(c => c.id === value.culture)!,
                    this.presets.getProfessionsForCulture(value.culture).find(p => p.id === value.profession)!
                ]);
    
                this.selections = selections;
    
                if(selections.length) {
                    this.selectionsControl.enable();
                    break;
                } else {
                    this.selectionsControl.disable();
                }
            }
            case 3: {
                const race = this.presets.getRacesForPreset(this.settingsControl.value.preset).find(r => r.id === this.backgroundControl.value.race)!
                const culture = this.presets.getCulturesForRace(this.backgroundControl.value.race).find(c => c.id === this.backgroundControl.value.culture)!;
                const profession = this.presets.getProfessionsForCulture(this.backgroundControl.value.culture).find(p => p.id === this.backgroundControl.value.profession)!;
    
                const { character, costs } = applyPartials(createEmptyCharacter(), [
                    race,
                    culture,
                    profession
                ], this.selectionsControl.value);
    
                character.about.name = this.backgroundControl.value.name;
                character.about.race = race.name;
                character.about.culture = culture.name;
                character.about.profession = profession.name;
                character.meta.budget = this.settingsControl.value.budget;
    
                this.character = character;
                this.costs = costs;
                this.budget = {
                    attributes: this.settingsControl.value.budget.attributes - costs.attributes,
                    skills    : this.settingsControl.value.budget.skills - costs.skills,
                    talents   : this.settingsControl.value.budget.talents - costs.talents
                };
                
                this.budget.attributes = this.settingsControl.value.budget.attributes - this.costs.attributes;
                this.attributesControl.setValue(this.character.attributes);
                console.log(this.settingsControl.value);
                console.log(this.character);
                console.log(this.costs);
                console.log(this.budget);
            }
            case 4: {
                this.budget.skills = this.settingsControl.value.budget.skills - this.costs.skills;
                this.budget.skills += this.budget.attributes * FACTOR_ATTRIBUTES / FACTOR_SKILLS;
                this.skillsGiftsControl.setValue({
                    skills: this.character.skills,
                    gifts: this.character.gifts
                });
                break;
            }
            case 5: {
                this.budget.talents = this.settingsControl.value.budget.talents - this.costs.talents;
                this.budget.talents += this.budget.skills * FACTOR_SKILLS / FACTOR_TALENTS;
                this.advantagesControl.setValue({
                    advantages: this.character.advantages,
                    disadvantages: this.character.disadvantages
                });
                break;
            }
            case 6: {
                this.talentsControl.setValue(this.character.talents);
                break;
            }
        }
    
        switch(this.stepperIndex) {
            case 0: this.backgroundControl.reset();
            case 1: this.selectionsControl.reset();
            case 2: this.attributesControl.reset();
            case 3: this.skillsGiftsControl.reset();
            case 4: this.advantagesControl.reset();
            case 5: this.talentsControl.reset();
        }
        
        // this.cd
    }
}
