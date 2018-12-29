/// <reference types="node" />

import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

export interface IPreset {
    id: string;
    name: string;
}

export interface IRace {
    id: string;
    name: string;
    presets: string[];
}

export interface ICulture {
    id: string;
    name: string;
    races: string[];
}

export interface IProfession {
    id: string;
    name: string;
    cultures: string[]
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
            this._races = require('./races.json').map(race => {
                race.name = this.i18n(race.name);
                return race;
            });
        }
        return this._races!;
    }
    private _races?: IRace[];
    
    protected get cultures() {
        if(!this._cultures) {
            this._cultures = require('./cultures.json').map(race => {
                race.name = this.i18n(race.name);
                return race;
            });
        }
        return this._cultures!;
    }
    private _cultures?: ICulture[];
    
    protected get professions() {
        if(!this._professions) {
            this._professions = require('./professions.json').map(race => {
                race.name = this.i18n(race.name);
                return race;
            });
        }
        return this._professions!;
    }
    private _professions?: IProfession[];
    
    constructor(protected readonly i18n : I18n) {}
    
    getPresets() : IPreset[] {
        return this.presets;
    }
    
    getRacesForPreset(preset : string) : IRace[] {
        return this.races.filter(race => race.presets.includes(preset));
    }
    
    getCulturesForRace(race : string) : ICulture[] {
        return this.cultures.filter(culture => culture.races.includes(race));
    }
    
    getProfessionsForCulture(culture : string) : IProfession[] {
        return this.professions.filter(profession => profession.cultures.includes(culture));
    }
}
