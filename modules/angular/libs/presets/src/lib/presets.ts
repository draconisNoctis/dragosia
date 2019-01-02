/// <reference types="node" />

import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';


export interface ICharacterAbout {
    name: string;
    race: string;
    culture: string;
    profession: string;
    description: string;
}

export interface ICharacterAttributes {
    strength: number;
    agility: number;
    dexterity: number;
    constitution: number;
    courage: number;
    intelligence: number;
    intuition: number;
    charisma: number;
}

export interface ICharacterSkills {
    melee: number;
    range: number;
    physical: number;
    mental: number;
}

export interface IGift {
    name: string;
    value: number;
}

export interface ITalent {
    id?: string;
    name: string;
    skill: string;
    attribute: string;
}

export interface ICharacterTalent extends ITalent {
    value: number;
}

export interface ICharacterTalents {
    melee: ICharacterTalent[];
    range: ICharacterTalent[];
    physical: ICharacterTalent[];
    mental: ICharacterTalent[];
    gifts: ICharacterTalent[];
}

export interface IMeleeWeapon {
    name: string;
    type: string;
    attribute: string;
    attackModification: number;
    paradeModification: number;
    damageModification: number;
}

export interface IRangeWeapon {
    name: string;
    type: string;
    attribute: string;
    range: string;
    attackModification: string;
    damageModification: string;
}

export interface ICharacter {
    _id: string;
    _changed?: boolean;
    
    about: ICharacterAbout;
    attributes: ICharacterAttributes;
    skills: ICharacterSkills;
    gifts: IGift[];
    advantages: string;
    disadvantages: string;
    health: number;
    mana: number;
    
    talents: ICharacterTalents;
    
    inventory: string;
    financials: string;
    equipment: string;
    
    melee: IMeleeWeapon[];
    range: IRangeWeapon[];
}

export interface IPreset {
    id: string;
    name: string;
}

export interface ICosts {
    attributes: number;
    skills: number;
    talents: number;
}

export interface IPartialTalent extends ITalent {
    id: string;
    category: keyof ICharacterTalents;
    presets?: string[];
}

export interface IPartialGift {
    id: string;
    name: string;
    presets?: string[];
}

export interface IPartialGiftWithValue extends IPartialGift {
    value: number;
}

export interface IPartialTalentWithValue extends IPartialTalent {
    value: number;
}

export interface ISelectTalents {
    nOf: IPartialTalent[];
    values: number[]
}

export interface IPartial {
    attributes?: Partial<ICharacterAttributes>;
    skills?: Partial<ICharacterSkills>;
    gifts?: IPartialGiftWithValue[];
    talents?: (IPartialTalentWithValue|ISelectTalents)[]//Partial<ICharacterTalents>;
}

export interface IRace extends IPartial {
    id: string;
    name: string;
    presets: string[];
}

export interface ICulture extends IPartial {
    id: string;
    name: string;
    races: string[];
}

export interface IProfession extends IPartial {
    id: string;
    name: string;
    cultures: string[]
}

export function createEmptyCharacter() : ICharacter {
    return {
        _id: (Math.random() * 1000000 | 0).toString(16),
        about: {
            name: '',
            description: '',
            race: '',
            culture: '',
            profession: ''
        },
        attributes: {
            strength: 1,
            agility: 1,
            dexterity: 1,
            constitution: 1,
            courage: 1,
            intelligence: 1,
            intuition: 1,
            charisma: 1
        },
        skills: {
            melee: 0,
            range: 0,
            physical: 0,
            mental: 0
        },
        talents: {
            melee: new Array<ICharacterTalent>(),
            range: new Array<ICharacterTalent>(),
            physical: new Array<ICharacterTalent>(),
            mental: new Array<ICharacterTalent>(),
            gifts: new Array<ICharacterTalent>()
        },
        gifts: new Array<IGift>(),
        
        advantages: '',
        disadvantages: '',
        health: 0,
        mana: 0,
        inventory: '',
        financials: '',
        equipment: '',
        
        melee: new Array<IMeleeWeapon>(),
        range: new Array<IRangeWeapon>()
    }
}

export const COSTS = [ 1, 1, 2, 3, 5, 8 ];

export function cloneCharacter(char : ICharacter) : ICharacter {
    return JSON.parse(JSON.stringify(char));
}

export function getCosts(current : number, next : number) : number {
    let costs = 0;
    if(current < next) {
        let n = next + 1;
        while(--n > current) {
            costs += COSTS[n];
        }
    } else if(current >  next) {
        let n = current + 1;
        while(--n > next) {
            costs -= COSTS[n];
        }
    }
    
    return costs;
}

export function getPartialSelections(partials : IPartial[]) : ISelectTalents[] {
    const selections : ISelectTalents[] = [];
    
    for(const partial of partials) {
        if(partial.talents) {
            for(const t of partial.talents) {
                if('nOf' in t) {
                    selections.push(t);
                }
            }
        }
    }
    
    return selections;
}

export function applyPartials(char : ICharacter, partials : IPartial[], selections : number[][]) : { character: ICharacter, costs: ICosts } {
    const character = cloneCharacter(char);
    const costs : ICosts = { attributes: 0, skills: 0, talents: 0 };
    
    let i = 0;
    for(const partial of partials) {
        if(partial.attributes) {
            for(const attr in partial.attributes) {
                costs.attributes += getCosts(character.attributes[attr], character.attributes[attr] + partial.attributes[attr]);
                character.attributes[attr] += partial.attributes[attr];
            }
        }
        if(partial.skills) {
            for(const skill in partial.skills) {
                costs.skills += getCosts(character.skills[skill], character.skills[skill] + partial.skills[skill]);
                character.skills[skill] += partial.skills[skill];
            }
        }
        if(partial.gifts) {
            for(const gift of partial.gifts) {
                const existingGift = character.gifts.find(g => g.name === gift.name);
                if(existingGift) {
                    costs.skills += getCosts(existingGift.value, existingGift.value + gift.value);
                    existingGift.value += gift.value;
                } else {
                    costs.skills += getCosts(-1, gift.value);
                    character.gifts.push(gift);
                }
            }
        }
        if(partial.talents) {
            for(const t of partial.talents) {
                let talents : IPartialTalentWithValue[];
                if('nOf' in t) {
                    talents = selections[i++].map((n, index) => {
                        return { ...t.nOf[n], value: t.values[index] };
                    });
                } else {
                    talents = [ t ];
                }
                for(const talent of talents) {
                    const existingTalent = character.talents[ talent.category ].find(t => t.name === talent.name);
    
                    if(existingTalent) {
                        costs.talents += getCosts(existingTalent.value, existingTalent.value + talent.value);
                        existingTalent.value += talent.value;
                    } else {
                        costs.talents += getCosts(-1, talent.value);
                        character.talents[ talent.category ].push(talent);
                    }
                }
            }
        }
    }
    
    return { character, costs };
}

@Injectable({
    providedIn: 'root'
})
export class Presets {
    protected get presets() {
        if(!this._presets) {
            this._presets = require('./presets.json').map(preset => {
                preset.name = this.i18n(preset.name);
                return preset;
            });
        }
        return this._presets;
    }
    private _presets?: IPreset[];
    
    protected get races() {
        if(!this._races) {
            this._races = require('./races.json').map((race : IRace) => {
                race.name = this.i18n(race.name);
                this.mapPartial(race);
                return race;
            });
        }
        return this._races!;
    }
    private _races?: IRace[];
    
    protected get cultures() {
        if(!this._cultures) {
            this._cultures = require('./cultures.json').map((culture : ICulture) => {
                culture.name = this.i18n(culture.name);
                this.mapPartial(culture);
                return culture;
            });
        }
        return this._cultures!;
    }
    private _cultures?: ICulture[];
    
    protected get professions() {
        if(!this._professions) {
            this._professions = require('./professions.json').map((profession : IProfession) => {
                profession.name = this.i18n(profession.name);
                this.mapPartial(profession);
                return profession;
            });
        }
        return this._professions!;
    }
    private _professions?: IProfession[];
    
    protected get talents() {
        if(!this._talents) {
            this._talents = require('./talents.json');
        }
        return this._talents!;
    }
    private _talents?: IPartialTalent[];
    
    protected get gifts() {
        if(!this._gifts) {
            this._gifts = require('./gifts.json');
        }
        return this._gifts!;
    }
    private _gifts?: IPartialGift[];
    
    constructor(protected readonly i18n : I18n) {}
    
    getPresets() : IPreset[] {
        return this.presets;
    }
    
    getRacesForPreset(preset : string) : IRace[] {
        return this.races.filter(race => race.presets.includes(preset));
    }
    
    getGiftsForPreset(preset : string) {
        return this.gifts.filter(g => !g.presets || g.presets.includes(preset));
    }
    
    getTalentsForPreset(preset : string) {
        return this.talents.filter(t => !t.presets || t.presets.includes(preset));
    }
    
    getCulturesForRace(race : string) : ICulture[] {
        return this.cultures.filter(culture => culture.races.includes(race));
    }
    
    getProfessionsForCulture(culture : string) : IProfession[] {
        return this.professions.filter(profession => profession.cultures.includes(culture));
    }
    
    getTalentById(id : string) {
        return this.talents.find(t => t.id === id);
    }
    
    getGiftById(id : string) {
        return this.gifts.find(g => g.id === id);
    }
    
    mapPartial(partial : IPartial) {
        if(partial.talents) {
            for(const talent of partial.talents) {
                if('nOf' in talent) {
                    for(const t of talent.nOf) {
                        Object.assign(t, this.getTalentById(t.id));
                    }
                } else {
                    Object.assign(talent, this.getTalentById(talent.id));
                }
            }
        }
        if(partial.gifts) {
            for(const gift of partial.gifts) {
                Object.assign(gift, this.getGiftById(gift.id));
            }
        }
    }
}
