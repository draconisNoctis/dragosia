import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page/page.component';
import { RadioRangeComponent } from './radio-range/radio-range.component';

@NgModule({
    imports     : [ CommonModule ],
    declarations: [ PageComponent, RadioRangeComponent ],
    exports     : [ PageComponent, RadioRangeComponent ]
})
export class JuiModule {
}
