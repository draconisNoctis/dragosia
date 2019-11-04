import { Inject, inject, Injectable, InjectionToken } from '@angular/core';
import { ICharacterAttributes, IGift, IAdvantage, ICharacterTalents, ICharacterTalent } from '@jina-draicana/presets';

export type Level = 'A*' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

function multipliersFactory() {
    return {
        'A*': .75,
        'A': 1,
        'B': 1.5,
        'C': 2.25,
        'D': 3.25,
        'E': 4.5,
        'F': 6
    };
};

function offsetsFactory() {
    return {
        'A*': 0,
        'A': 0,
        'B': 0,
        'C': 0,
        'D': 0,
        'E': 0,
        'F': 0
    };
};

function activationMultiplierFactory() {
    return 3;
}

function expBasisFactory() {
    return Math.sqrt(2);
}

export const MULTIPLIERS = new InjectionToken<{ [P in Level]: number }>('MULTIPLIERS', { providedIn: 'root', factory: multipliersFactory })
export const OFFSETS = new InjectionToken<{ [P in Level]: number }>('OFFSETS', { providedIn: 'root', factory: offsetsFactory })
export const ACTIVATION_MULTIPLIER = new InjectionToken<number>('ACTIVATION_MULTIPLIER', { providedIn: 'root', factory: activationMultiplierFactory })
export const EXP_BASIS = new InjectionToken<number>('EXP_BASIS', { providedIn: 'root', factory: expBasisFactory });

export function raiseServiceFactory() {
    // return new FibonacciRaiseService(inject(OFFSETS), inject(MULTIPLIERS), inject(ACTIVATION_MULTIPLIER));
    return new ExponentialRaiseService(inject(OFFSETS), inject(MULTIPLIERS), inject(ACTIVATION_MULTIPLIER), inject(EXP_BASIS));
}

@Injectable({
    providedIn: 'root',
    useFactory: raiseServiceFactory
})
export abstract class RaiseService {
    abstract getRaiseCosts(to: number, level: Level, option?: { from?: number, reduced?: boolean }): number;
    abstract getActivationCost(level: Level): number;

    getAttributesCosts(attributes : ICharacterAttributes) : number {
        return Object.keys(attributes).reduce((t, attr) => {
            return t + this.getRaiseCosts(attributes[attr], 'E', { from: 0 });
        }, 0);
    }

    getAttributesDiffCosts(current : ICharacterAttributes, previous : ICharacterAttributes) : number {
        return Object.keys(current).reduce((t, attr) => {
            return t + this.getRaiseCosts(current[attr], 'E', { from: previous[attr] });
        }, 0);
    }

    getGiftsCosts(gifts : IGift[]) : number {
        return gifts.reduce((t, gift) => {
            return t + this.getRaiseCosts(gift.value, gift.level, { from: 0 }) + this.getActivationCost(gift.level);
        }, 0);
    }

    getGiftsCostDiff(current : IGift[], previous : IGift[]) : number {
        const previousMap = new Map(previous.map(gift => [ gift.name, gift ] as [ string, IGift ]));

        return current.reduce((t, gift) => {
            if(previousMap.has(gift.name)) {
                return t + this.getRaiseCosts(gift.value, gift.level, { from: previousMap.get(gift.name)!.value });
            } else {
                return t + this.getRaiseCosts(gift.value, gift.level, { from: 0 }) + this.getActivationCost(gift.level);
            }
        }, 0);
    }

    getAdvantagesCosts(advantages : IAdvantage[]) : number {
        return advantages.reduce((t, advantage) => t + advantage.value, 0);
    }

    getDisadvantagesCosts(disadvantages : IAdvantage[]) : number {
        return disadvantages.reduce((t, disadvantage) => t + disadvantage.value, 0);
    }

    getTalentsCosts(talents : ICharacterTalents) {
        return Object.values(talents).reduce((t, talents : ICharacterTalent[]) => {
            return t + talents.reduce((t, talent) => {
                return t + this.getRaiseCosts(talent.value, talent.level, { from: 0 });
            }, 0)
        }, 0)
    }
}

@Injectable()
export class ExponentialRaiseService extends RaiseService {
    protected readonly levels = Object.keys(this.multipliers) as Level[];

    constructor(@Inject(OFFSETS) protected readonly offsets: { [P in Level]: number },
        @Inject(MULTIPLIERS) protected readonly multipliers: { [P in Level]: number },
        @Inject(ACTIVATION_MULTIPLIER) protected readonly activationMultiplier: number,
        @Inject(EXP_BASIS) protected readonly basis: number) {
        super();
    }

    getRaiseCosts(to: number, level: Level, { from = to - 1, reduced }: { from?: number; reduced?: boolean; } = {}): number {
        if (reduced) {
            level = this.levels[this.levels.indexOf(level) - 1];
        }

        let sum = 0;
        while (from++ < to) {
            sum += Math.round(Math.pow(this.basis, from) * this.multipliers[level] + this.offsets[level]);
        }

        return sum;
    }

    getActivationCost(level: Level) {
        return Math.round(this.activationMultiplier * this.basis * this.multipliers[level] + this.offsets[level]);
    }
}

@Injectable()
export class FibonacciRaiseService extends RaiseService {
    protected readonly levels = Object.keys(this.multipliers) as Level[];

    constructor(@Inject(OFFSETS) protected readonly offsets: { [P in Level]: number },
        @Inject(MULTIPLIERS) protected readonly multipliers: { [P in Level]: number },
        @Inject(ACTIVATION_MULTIPLIER) protected readonly activationMultiplier: number) {
        super();
    }

    getRaiseCosts(to: number, level: Level, { from = to - 1, reduced }: { from?: number; reduced?: boolean; } = {}): number {
        if (reduced) {
            level = this.levels[this.levels.indexOf(level) - 1];
        }

        let sum = 0;
        while (from++ < to) {
            sum += Math.round(this.getFibonacci(from + 1) * this.multipliers[level] + this.offsets[level]);
        }

        return sum;
    }

    getActivationCost(level: Level) {
        return Math.round(this.activationMultiplier * this.multipliers[level] + this.offsets[level]);
    }

    protected getFibonacci(n: number): number {
        let a = 1, b = 1;

        if (n < 3) {
            return 1;
        }

        while (n-- >= 3) {
            const t = b;
            b += a;
            a = t;
        }

        return b;
    }
}
