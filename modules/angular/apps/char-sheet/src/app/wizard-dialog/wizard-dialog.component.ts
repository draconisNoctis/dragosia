import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectionStrategy, ViewChild
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material';
import {
    applyPartials,
    createEmptyCharacter,
    getPartialSelections,
    ICharacter,
    ICosts, ISelectTalents,
    Presets
} from '@jina-draicana/presets';
import { debounceTime, delay, filter } from 'rxjs/operators';

@Component({
    selector: 'cs-wizard-dialog',
    templateUrl: './wizard-dialog.component.html',
    styleUrls: ['./wizard-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardDialogComponent implements OnInit {
    settingsControl = new FormControl(null, Validators.required);
    backgroundControl = new FormControl(null, Validators.required);
    selectionsControl = new FormControl({ value: null, disabled: true }, Validators.required);
    attributesControl = new FormControl({
        strength: 1,
        agility: 1,
        dexterity: 1,
        constitution: 1,
        courage: 1,
        intelligence: 1,
        intuition: 1,
        charisma: 1
    }, Validators.required);
    
    character?: ICharacter;
    costs?: ICosts;
    budget?: ICosts;
    
    selections?: ISelectTalents[];
    
    @ViewChild(MatHorizontalStepper)
    stepper!: MatHorizontalStepper;

    constructor(protected readonly presets : Presets) {}

    ngOnInit() {
        this.backgroundControl.valueChanges.subscribe(value => {
            if(value && value.race && value.culture && value.profession) {
                const selections = getPartialSelections([
                    this.presets.getRacesForPreset(this.settingsControl.value.preset).find(r => r.id === value.race)!,
                    this.presets.getCulturesForRace(value.race).find(c => c.id === value.culture)!,
                    this.presets.getProfessionsForCulture(value.culture).find(p => p.id === value.profession)!
                ]);
                
                this.selections = selections;
                
                if(selections.length) {
                    this.selectionsControl.enable();
                } else {
                    this.selectionsControl.disable();
                    this.createCharacter();
                }
            }
        });
        
        this.selectionsControl.valueChanges.pipe(filter(Boolean), delay(1)).subscribe(() => {
            this.createCharacter();
        })
    }
    
    createCharacter() {
        if((!this.selections || this.selections.length > 0) && (!this.selectionsControl.value || this.selectionsControl.value.length !== this.selections.length)) {
            return;
        }
        
        const { character, costs } = applyPartials(createEmptyCharacter(), [
            this.presets.getRacesForPreset(this.settingsControl.value.preset).find(r => r.id === this.backgroundControl.value.race)!,
            this.presets.getCulturesForRace(this.backgroundControl.value.race).find(c => c.id === this.backgroundControl.value.culture)!,
            this.presets.getProfessionsForCulture(this.backgroundControl.value.culture).find(p => p.id === this.backgroundControl.value.profession)!
        ], this.selectionsControl.value);
        
        character.about.name = this.backgroundControl.value.name;
    
        this.character = character;
        this.costs = costs;
        this.budget = {
            attributes: this.settingsControl.value.budget.attributes - costs.attributes,
            skills: this.settingsControl.value.budget.skills - costs.skills,
            talents: this.settingsControl.value.budget.talents - costs.talents
        };
        this.attributesControl.setValue(this.character.attributes);
        console.log(this.character);
        console.log(this.costs);
        console.log(this.budget);
    }
    
    nextAfterBackground() {
        this.stepper.next();
        if(this.selections.length === 0) {
            this.stepper.next();
        }
    }
}
