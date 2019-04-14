import { Injectable } from '@angular/core';

export type Level = 'A*' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export function raiseServiceFactory() {
    return new FibonacciRaiseService();
}

@Injectable({
    providedIn: 'root',
    useFactory: raiseServiceFactory
})
export abstract class RaiseService {
    abstract getRaiseCosts(to: number, level: Level, option?: { from?: number, reduced?: boolean }): number;
}

@Injectable()
export class FibonacciRaiseService implements RaiseService {
    protected readonly multipliers : { [P in Level]: number } = {
        'A*': .75,
        'A': 1,
        'B': 1.5,
        'C': 2.25,
        'D': 3.25,
        'E': 4.5,
        'F': 6
    }

    protected readonly levels = Object.keys(this.multipliers) as Level[];

    getRaiseCosts(to: number, level: Level, { from = to - 1, reduced }: { from?: number; reduced?: boolean; }= {}): number {
        if(reduced) {
            level = this.levels[this.levels.indexOf(level) - 1];
        }

        let sum = 0;
        while(++from < to) {
            sum += Math.round(this.getFibonacci(from + 1) * this.multipliers[level]);
        }

        return sum;
    }

    protected getFibonacci(n : number) : number {
        let a = 1, b = 1;

        if(n < 3) {
            return 1;
        }

        while(n-- >= 3) {
            const t = b;
            b += a;
            a = t;
        }

        return b;
    }
}
