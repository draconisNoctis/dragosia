/// <reference types="node" />

import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as yaml from 'js-yaml';
import { CHARACTER_PROVIDER, CURRENT_CHARACTER_VERSION } from '../../../sheet/src/lib/character.service';
import * as uuid from 'uuid';
import { RaiseService, Level } from '@jina-draicana/sheet';


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
    level: Level;
}

export interface IAdvantageDisadvantageDetails {
    type: keyof ICharacterSkills | 'gift' | 'common';
    typeGiftName?: string;
    multi?: boolean;
    description: string;
    info?: string;
    requirements?: {
        attributes?: {
            [a in keyof ICharacterAttributes]?: number;
        };
        skills?: {
            [s in keyof ICharacterSkills]?: number;
        };
        gifts?: {
            [name: string]: number;
        }
    };
    incompatible?: {
        gifts?: string[];
        advantages: string[];
        disadvantages: string[];
    }
}

export interface IAdvantage {
    name: string;
    value: number;
    specialization?: string;
    custom?: boolean;
    presets?: string[];
}

export interface IDisadvantage {
    name: string;
    value: number;
    specialization?: string;
    custom?: boolean;
    presets?: string[];
}

export interface ITalent {
    id?: string;
    name: string;
    skill?: string;
    gift?: string;
    attribute: string;
    level: Level;
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

export interface ICharacterMeta {
    preset: string;
    exp: {
        spend: number;
        total: number;
    }
    initValues: IInitValues
}

export interface ICharacter {
    _id: string;
    _changed?: boolean;
    _user?: string;
    provider : CHARACTER_PROVIDER;
    version: number;

    about: ICharacterAbout;
    attributes: ICharacterAttributes;
    skills: ICharacterSkills;
    gifts: IGift[];
    advantages: IAdvantage[];
    disadvantages: IDisadvantage[];
    health: number;
    mana: number;

    talents: ICharacterTalents;
    meta: ICharacterMeta;

    armor: IArmor[];
    inventory: string;
    financials: string;
    equipment: string;

    melee: IMeleeWeapon[];
    range: IRangeWeapon[];
}

export interface IArmorValues {
    head: number;
    chest: number;
    back: number;
    leftArm: number;
    rightArm: number;
    leftLeg: number;
    rightLeg: number;
}

export interface IArmor extends IArmorValues {
    name: string;
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

export interface IInitValues {
    level: string;
    exp: number;
    attributes: {
        min: number;
        max: number;
    };
    skills: {
        min: number;
        max: number;
    };
    talents: {
        min: number;
        max: number;
    };
}

export interface IPartialTalent extends ITalent {
    // id: string;
    category: keyof ICharacterTalents;
    presets?: string[];
    level: Level;
}

export interface IPartialGift {
    // id: string;
    name: string;
    presets?: string[];
    level: Level;
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
    extends?: string;
    abstract?: boolean;
    attributes?: Partial<ICharacterAttributes>;
    skills?: Partial<ICharacterSkills>;
    gifts?: IPartialGiftWithValue[];
    talents?: (IPartialTalentWithValue|ISelectTalents)[]
}

export interface IRace extends IPartial {
    // id: string;
    name: string;
    presets: string[];
}

export interface ICulture extends IPartial {
    // id: string;
    name: string;
    races: string[];
}

export interface IProfession extends IPartial {
    // id: string;
    name: string;
    cultures: string[]
}

export function createEmptyCharacter() : ICharacter {
    return {
        _id: uuid(),
        provider: null!,
        version: CURRENT_CHARACTER_VERSION,
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
            melee: [],
            range: [],
            physical: [],
            mental: [],
            gifts: []
        },
        gifts: [],

        advantages: [],
        disadvantages: [],
        health: 0,
        mana: 0,
        inventory: '',
        financials: '',
        equipment: '',
        armor: [],
        meta: {
            preset: '',
            // budget: {
            //     attributes: 0,
            //     skills: 0,
            //     talents: 0
            // },
            initValues: {
                level: '',
                exp: 0,
                attributes: {
                    max: 0,
                    min: 0
                },
                skills: {
                    max: 0,
                    min: 0
                },
                talents: {
                    max: 0,
                    min: 0
                }
            },
            exp: {
                spend: 0,
                total: 0
            }
        },

        melee: [],
        range: []
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

export function applyPartials(char : ICharacter, raiseService : RaiseService, partials : IPartial[], selections : number[][]) : ICharacter {
    const character = cloneCharacter(char);
    // let spend = 0;
    // const costs : ICosts = { attributes: 0, skills: 0, talents: 0 };

    let i = 0;
    for(const partial of partials) {
        if(partial.attributes) {
            for(const attr in partial.attributes) {
                // spend += raiseService.getRaiseCosts(character.attributes[attr] + partial.attributes[attr], 'E', { from: character.attributes[attr] });
                // costs.attributes += getCosts(character.attributes[attr], character.attributes[attr] + partial.attributes[attr]);
                character.attributes[attr] += partial.attributes[attr];
            }
        }
        if(partial.skills) {
            for(const skill in partial.skills) {
                // spend += raiseService.getRaiseCosts(character.skills[skill] + partial.skills[skill], 'F', { from: character.skills[skill] });
                // costs.skills += getCosts(character.skills[skill], character.skills[skill] + partial.skills[skill]);
                character.skills[skill] += partial.skills[skill];
            }
        }
        if(partial.gifts) {
            for(const gift of partial.gifts) {
                const existingGift = character.gifts.find(g => g.name === gift.name);
                if(existingGift) {
                    // costs.skills += getCosts(existingGift.value, existingGift.value + gift.value);
                    // spend += raiseService.getRaiseCosts(existingGift.value + gift.value, gift.level, { from: existingGift.value });
                    existingGift.value += gift.value;
                } else {
                    // costs.skills += getCosts(-1, gift.value);
                    // spend += raiseService.getRaiseCosts(gift.value, gift.level, { from: 0 });
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
                        // costs.talents += getCosts(existingTalent.value, existingTalent.value + talent.value);
                        // spend += raiseService.getRaiseCosts(existingTalent.value + talent.value, talent.level, { from: existingTalent.value });
                        existingTalent.value += talent.value;
                    } else {
                        // costs.talents += getCosts(-1, talent.value);
                        // spend += raiseService.getRaiseCosts(talent.value, talent.level, { from: 0 });
                        character.talents[ talent.category ].push(talent);
                    }
                }
            }
        }
    }

    return character;
    // return { character, spend };
}

@Injectable({
    providedIn: 'root'
})
export class Presets {
    protected get presets() {
        if(!this._presets) {
            this._presets = yaml.safeLoadAll(require('raw-loader!./presets.yml'));
        }
        return this._presets;
    }
    private _presets?: IPreset[];

    protected get races() {
        if(!this._races) {
            this._races = yaml.safeLoadAll(require('raw-loader!./races.yml')).map((race : IRace) => {
                this.mapPartial(race);
                return race;
            });
        }
        return this._races!;
    }
    private _races?: IRace[];

    protected get cultures() {
        if(!this._cultures) {
            this._cultures = yaml.safeLoadAll(require('raw-loader!./cultures.yml')).map((culture : ICulture) => {
                this.mapPartial(culture);
                return culture;
            });
        }
        return this._cultures!;
    }
    private _cultures?: ICulture[];

    protected get professions() {
        if(!this._professions) {
            this._professions = yaml.safeLoadAll(require('raw-loader!./professions.yml')).map((profession : IProfession) => {
                this.mapPartial(profession);
                return profession;
            });
        }
        return this._professions!;
    }
    private _professions?: IProfession[];

    protected get talents() {
        if(!this._talents) {
            this._talents = yaml.safeLoadAll(require('raw-loader!./talents.yml'));
        }
        return this._talents!;
    }
    private _talents?: IPartialTalent[];

    protected get gifts() {
        if(!this._gifts) {
            this._gifts = yaml.safeLoadAll(require('raw-loader!./gifts.yml'));
        }
        return this._gifts!;
    }
    private _gifts?: IPartialGift[];

    protected get advantages() {
        if(!this._advantages) {
            this._advantages = yaml.safeLoadAll(require('raw-loader!./advantages.yml'));
        }
        return this._advantages!;
    }
    private _advantages?: (IAdvantage & IAdvantageDisadvantageDetails)[];

    protected get disadvantages() {
        if(!this._disadvantages) {
            this._disadvantages = yaml.safeLoadAll(require('raw-loader!./disadvantages.yml'));
        }
        return this._disadvantages!;
    }
    private _disadvantages?: (IDisadvantage & IAdvantageDisadvantageDetails)[];

    constructor(protected readonly i18n : I18n) {}

    getPresets() : IPreset[] {
        return this.presets;
    }

    getRacesForPreset(preset : string) : IRace[] {
        return this.races.filter(race => !race.abstract && race.presets.includes(preset)).map(p => this.resolvePartial('races', p));
    }

    getGiftsForPreset(preset : string) {
        return this.gifts.filter(g => !g.presets || g.presets.includes(preset));
    }

    getTalentsForPreset(preset : string) {
        return this.talents.filter(t => !t.presets || t.presets.includes(preset));
    }

    getAdvantagesForPreset(preset : string) {
        return this.advantages.filter(a => !a.presets || a.presets.includes(preset));
    }

    getDisadvantagesForPreset(preset : string) {
        return this.disadvantages.filter(d => !d.presets || d.presets.includes(preset));
    }

    getCulturesForRace(race : string) : ICulture[] {
        return this.cultures.filter(culture => !culture.abstract && culture.races.includes(race)).map(p => this.resolvePartial('cultures', p));
    }

    getProfessionsForCulture(culture : string) : IProfession[] {
        return this.professions.filter(profession => !profession.abstract && profession.cultures.includes(culture)).map(p => this.resolvePartial('professions', p));
    }

    getTalentByName(name : string) {
        return this.talents.find(t => t.name === name);
    }

    getGiftByName(name : string) {
        return this.gifts.find(g => g.name === name);
    }

    protected resolvePartial<T extends IPartial>(type: 'races'|'cultures'|'professions', partial : T) : T {
        if(!partial.extends) {
            return partial;
        }

        const parent = this[type as any].find(p => p.name === partial.extends);

        console.assert(!!parent);

        return this.mergePartials<T>(parent, partial);
    }

    protected mergePartials<T extends IPartial>(a : IPartial, b : IPartial) : T {
        const res = { ...a, ...b } as T;

        res.attributes = { ...a.attributes, ...b.attributes };
        res.skills = { ...a.skills, ...b.skills };
        res.gifts = [ ...(a.gifts || []), ...(b.gifts || []) ];
        res.talents = [ ...(a.talents || []), ...(b.talents || []) ];

        return res;
    }

    mapPartial(partial : IPartial) {
        if(partial.talents) {
            for(const talent of partial.talents) {
                if('nOf' in talent) {
                    for(const t of talent.nOf) {
                        Object.assign(t, this.getTalentByName(t.name));
                    }
                } else {
                    Object.assign(talent, this.getTalentByName(talent.name));
                }
            }
        }
        if(partial.gifts) {
            for(const gift of partial.gifts) {
                Object.assign(gift, this.getGiftByName(gift.name));
            }
        }
    }

    getTypeName(type : keyof ICharacterSkills | 'common' | 'gift') {
        switch(type) {
            case 'common': return this.i18n('Common');
            case 'gift': return this.i18n('Gift');
            default: return this.getSkillName(type);
        }
    }

    getSkillName(name : keyof ICharacterSkills) {
        switch(name) {
            case 'melee': return this.i18n('Melee');
            case 'range': return this.i18n('Range');
            case 'physical': return this.i18n('Physical');
            case 'mental': return this.i18n('Mental');
        }
    }

    getSkillNameShort(name : keyof ICharacterSkills) {
        switch(name) {
            case 'melee': return this.i18n({ value: 'Melee', meaning: 'short' });
            case 'range': return this.i18n({ value: 'Range', meaning: 'short' });
            case 'physical': return this.i18n({ value: 'Physical', meaning: 'short' });
            case 'mental': return this.i18n({ value: 'Mental', meaning: 'short' });
        }
    }

    getAttributeName(name : keyof ICharacterAttributes) {
        switch(name) {
            case 'strength': return this.i18n('Strength');
            case 'agility': return this.i18n('Agility');
            case 'dexterity': return this.i18n('Dexterity');
            case 'constitution': return this.i18n('Constitution');
            case 'courage': return this.i18n('Courage');
            case 'intuition': return this.i18n('Intuition');
            case 'intelligence': return this.i18n('Intelligence');
            case 'charisma': return this.i18n('Charisma');
        }
    }

    getAttributeNameShort(name : keyof ICharacterAttributes) {
        switch(name) {
            case 'strength': return this.i18n({ value:'Strength', meaning: 'short' });
            case 'agility': return this.i18n({ value:'Agility', meaning: 'short' });
            case 'dexterity': return this.i18n({ value:'Dexterity', meaning: 'short' });
            case 'constitution': return this.i18n({ value:'Constitution', meaning: 'short' });
            case 'courage': return this.i18n({ value:'Courage', meaning: 'short' });
            case 'intuition': return this.i18n({ value:'Intuition', meaning: 'short' });
            case 'intelligence': return this.i18n({ value:'Intelligence', meaning: 'short' });
            case 'charisma': return this.i18n({ value:'Charisma', meaning: 'short' });
        }
    }
}
