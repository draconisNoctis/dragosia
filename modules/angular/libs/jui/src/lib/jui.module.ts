import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page/page.component';

@NgModule({
    imports     : [ CommonModule ],
    declarations: [ PageComponent ],
    exports     : [ PageComponent ]
})
export class JuiModule {
}
