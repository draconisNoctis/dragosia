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
    Presets,
    ICharacterAttributes,
    ICharacterSkills,
    IGift,
    IAdvantage,
    ICharacterTalents,
    ICharacterTalent
} from '@jina-draicana/presets';
import { FACTOR_ATTRIBUTES, FACTOR_SKILLS, FACTOR_TALENTS, RaiseService } from '@jina-draicana/sheet';
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
export class WizardDialogComponent implements OnInit {
    settingsControl = new FormControl(null, Validators.required);
    backgroundControl = new FormControl({ name: 'Alrik' }, Validators.required);
    selectionsControl = new FormControl({ value: null, disabled: true }, Validators.required);
    attributesControl = new FormControl(null, [ Validators.required, ({ value}) => {
        if(!value) {
            return null;
        }

        if(this.attributesCosts(value) < this.character!.meta.points.attributes.min) {
            return { min: this.character!.meta.points.attributes.min }
        }

        return null;
    }]);
    skillsGiftsControl = new FormGroup({
        skills: new FormControl(null),
        gifts : new FormControl(null)
    });
    talentsControl = new FormControl(null, Validators.required);
    advantagesControl = new FormControl(null, [ Validators.required, ({ value}) => {
        if(null == value) {
            return null;
        }

        if(Math.abs(this.advantagesCosts(value.advantages) - this.disadvantagesCosts(value.disadvantages)) > 10) {
            return { unbalanced: true }
        }

        return null;
    }]);

    character? : ICharacter;
    // costs? : ICosts;
    // budget? : ICosts;

    selections? : ISelectTalents[];

    @ViewChild(MatHorizontalStepper)
    stepper! : MatHorizontalStepper;

    stepperIndex = 0;

    get spend() {
        return this.spendForAttributes + this.spendForSkills + this.spendForGifts + this.advantageBalance + this.spendForTalents;
    }

    get spendForAttributes() {
        if(!this.character) {
            return 0;
        }

        return this.attributesCosts(this.character.attributes);
    }

    get spendForSkills() {
        if(!this.character) {
            return 0;
        }

        return this.skillsCosts(this.character.skills);
    }

    get spendForGifts() {
        if(!this.character) {
            return 0;
        }

        return this.giftsCosts(this.character.gifts);
    }

    get spendForTalents() {
        if(!this.character) {
            return 0;
        }

        return this.talentsCosts(this.character.talents);
    }

    get spendForAdvantages() {
        if(!this.character) {
            return 0;
        }

        return this.advantagesCosts(this.character.advantages);
    }

    get gainedForDisadvantages() {
        if(!this.character) {
            return 0;
        }

        return this.disadvantagesCosts(this.character.disadvantages);
    }

    get advantageBalance() {
        return this.spendForAdvantages - this.gainedForDisadvantages;
    }

    get advantageBalanceAbsolute() {
        return Math.abs(this.advantageBalance);
    }

    constructor(protected readonly presets : Presets,
                protected readonly ref : MatDialogRef<WizardDialogComponent>,
                protected readonly raiseService : RaiseService) {
    }

    ngOnInit() {
        if(this.presets.getPresets().length === 1) {
            this.settingsControl.setValue({ preset: this.presets.getPresets()[0].id });
        }

        this.attributesControl.valueChanges.subscribe(value => {
            if(value && this.character) {
                this.character.attributes = value;
            }
        });

        this.skillsGiftsControl.valueChanges.subscribe(value => {
            if(value && this.character) {
                if(value.skills) {
                    this.character.skills = value.skills;
                }
                if(value.gifts) {
                    this.character.gifts = value.gifts;
                }
            }
        });

        this.advantagesControl.valueChanges.subscribe(value => {
            if(value && this.character) {
                if(value.advantages) {
                    this.character.advantages = value.advantages;
                }
                if(value.disadvantages) {
                    this.character.disadvantages = value.disadvantages;
                }
            }
        });

        this.talentsControl.valueChanges.subscribe(value => {
            if(value && this.character) {
                this.character.talents = value;
            }
        })
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

        // this.character.meta.exp.spend = this.costs.attributes * 4 + this.costs.skills * 2 + this.costs.talents;
        // this.character.meta.exp.total = this.character.meta.exp.spend + this.budget.talents;

        console.log(this.character);
        this.ref.close(this.character);
    }

    stepperChange(event : StepperSelectionEvent) {
        this.stepperIndex = event.selectedIndex;

        console.log('stepperIndex', this.stepperIndex);

        switch(this.stepperIndex) {
            case 0: {
                this.settingsControl.reset();
                break;
            }
            case 2: {
                const value = this.backgroundControl.value;
                const selections = getPartialSelections([
                    this.presets.getRacesForPreset(this.settingsControl.value.preset).find(r => r.name === value.race)!,
                    this.presets.getCulturesForRace(value.race).find(c => c.name === value.culture)!,
                    this.presets.getProfessionsForCulture(value.culture).find(p => p.name === value.profession)!
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
                const race = this.presets.getRacesForPreset(this.settingsControl.value.preset).find(r => r.name === this.backgroundControl.value.race)!
                const culture = this.presets.getCulturesForRace(this.backgroundControl.value.race).find(c => c.name === this.backgroundControl.value.culture)!;
                const profession = this.presets.getProfessionsForCulture(this.backgroundControl.value.culture).find(p => p.name === this.backgroundControl.value.profession)!;

                const character = applyPartials(createEmptyCharacter(), this.raiseService, [
                    race,
                    culture,
                    profession
                ], this.selectionsControl.value);

                character.about.name = this.backgroundControl.value.name;
                character.about.race = race.name;
                character.about.culture = culture.name;
                character.about.profession = profession.name;
                const { points, attributes, skills, talents } = this.settingsControl.value.points;
                character.meta.exp = {
                    spend: 0,
                    total: points
                }
                character.meta.points = { attributes, skills, talents }
                // character.meta.budget = this.settingsControl.value.budget;

                this.character = character;
                // this.costs = costs;
                // this.budget = {
                //     attributes: this.settingsControl.value.budget.attributes - costs.attributes,
                //     skills    : this.settingsControl.value.budget.skills - costs.skills,
                //     talents   : this.settingsControl.value.budget.talents - costs.talents
                // };

                // this.budget.attributes = this.settingsControl.value.budget.attributes - this.costs.attributes;
                this.attributesControl.setValue(this.character.attributes);
                console.log(this.settingsControl.value);
                console.log(this.character);
                // console.log(this.budget);
            }
            case 4: {
                // this.budget.skills = this.settingsControl.value.budget.skills - this.costs.skills;
                // this.budget.skills += this.budget.attributes * FACTOR_ATTRIBUTES / FACTOR_SKILLS;
                this.skillsGiftsControl.setValue({
                    skills: this.character.skills,
                    gifts: this.character.gifts
                });
                break;
            }
            case 5: {
                // this.budget.talents = this.settingsControl.value.budget.talents - this.costs.talents;
                // this.budget.talents += this.budget.skills * FACTOR_SKILLS / FACTOR_TALENTS;
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


    protected attributesCosts(attributes : ICharacterAttributes) : number {
        return Object.keys(attributes).reduce((t, attr) => {
            return t + this.raiseService.getRaiseCosts(attributes[attr], 'E', { from: 0 });
        }, 0);
    }

    protected attributesDiffCosts(current : ICharacterAttributes, previous : ICharacterAttributes) : number {
        return Object.keys(current).reduce((t, attr) => {
            return t + this.raiseService.getRaiseCosts(current[attr], 'E', { from: previous[attr] });
        }, 0);
    }

    protected skillsCosts(skills : ICharacterSkills) : number {
        return Object.keys(skills).reduce((t, skill) => {
            return t + this.raiseService.getRaiseCosts(skills[skill], 'F', { from: 0 });
        }, 0);
    }

    protected skillsDiffCosts(current : ICharacterSkills, previous : ICharacterSkills) : number {
        return Object.keys(current).reduce((t, attr) => {
            return t + this.raiseService.getRaiseCosts(current[attr], 'F', { from: previous[attr] });
        }, 0);
    }

    protected giftsCosts(gifts : IGift[]) : number {
        return gifts.reduce((t, gift) => {
            return t + this.raiseService.getRaiseCosts(gift.value, gift.level, { from: 0 }) + this.raiseService.getActivationCost(gift.level);
        }, 0);
    }

    protected advantagesCosts(advantages : IAdvantage[]) : number {
        return advantages.reduce((t, advantage) => t + advantage.value, 0);
    }

    protected disadvantagesCosts(advantages : IAdvantage[]) : number {
        return advantages.reduce((t, advantage) => t + advantage.value, 0);
    }

    protected talentsCosts(talents : ICharacterTalents) {
        return Object.values(talents).reduce((t, talents : ICharacterTalent[]) => {
            return t + talents.reduce((t, talent) => {
                return t + this.raiseService.getRaiseCosts(talent.value, talent.level, { from: 0 });
            }, 0)
        }, 0)
    }
}
