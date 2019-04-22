import { Inject, inject, Injectable, InjectionToken } from '@angular/core';

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
}

@Injectable()
export class ExponentialRaiseService implements RaiseService {
    protected readonly levels = Object.keys(this.multipliers) as Level[];

    constructor(@Inject(OFFSETS) protected readonly offsets: { [P in Level]: number },
        @Inject(MULTIPLIERS) protected readonly multipliers: { [P in Level]: number },
        @Inject(ACTIVATION_MULTIPLIER) protected readonly activationMultiplier: number,
        @Inject(EXP_BASIS) protected  readonly basis : number) {

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
export class FibonacciRaiseService implements RaiseService {
    protected readonly levels = Object.keys(this.multipliers) as Level[];

    constructor(@Inject(OFFSETS) protected readonly offsets: { [P in Level]: number },
        @Inject(MULTIPLIERS) protected readonly multipliers: { [P in Level]: number },
        @Inject(ACTIVATION_MULTIPLIER) protected readonly activationMultiplier: number) {

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
