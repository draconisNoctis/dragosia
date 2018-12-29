import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JuiModule } from '@jina-draicana/jui';
import { SheetComponent } from './sheet/sheet.component';
import { AttributesComponent } from './attributes/attributes.component';

@NgModule({
    imports     : [ CommonModule, JuiModule, FormsModule, ReactiveFormsModule ],
    declarations: [ SheetComponent, AttributesComponent ],
    exports     : [ SheetComponent, AttributesComponent ]
})
export class SheetModule {
}
