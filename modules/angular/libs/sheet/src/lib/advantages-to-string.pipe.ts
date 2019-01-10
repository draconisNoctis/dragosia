import { Pipe, PipeTransform } from '@angular/core';
import { IAdvantage, IDisadvantage } from '@jina-draicana/presets';

@Pipe({
  name: 'advantagesToString'
})
export class AdvantagesToStringPipe implements PipeTransform {

  transform(value: IAdvantage[]|IDisadvantage[]): any {
    return value.map(v => {
        let str = v.name;
        if(v.specialization) {
            str += ` (${v.specialization})`
        }
        if(v.custom) {
            str += ` (${v.value})`
        }
        return str;
    }).sort((a : string, b : string) => a.localeCompare(b)).join(', ')
  }

}
