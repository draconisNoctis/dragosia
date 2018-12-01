import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuiModule } from '@jina-draicana/jui';
import { SheetComponent } from './sheet/sheet.component';

@NgModule({
    imports     : [ CommonModule, JuiModule ],
    declarations: [ SheetComponent ],
    exports     : [ SheetComponent ]
})
export class SheetModule {
}
