import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CostsPipe } from './costs.pipe';

@NgModule({
    imports     : [ CommonModule ],
    declarations: [ CostsPipe ],
    exports     : [ CostsPipe ]
})
export class PresetsModule {
}
