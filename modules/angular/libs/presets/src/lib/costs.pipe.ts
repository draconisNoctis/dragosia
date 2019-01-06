import { Pipe, PipeTransform } from '@angular/core';
import { COSTS } from './presets';

@Pipe({
    name: 'costs'
})
export class CostsPipe implements PipeTransform {
    
    transform(value : number, factor = 1) : any {
        return COSTS[value|0] * factor;
    }
    
}
