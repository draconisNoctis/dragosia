import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { JuiModule } from '@jina-draicana/jui';
import { SheetComponent } from './sheet/sheet.component';
import { AttributesComponent } from './attributes/attributes.component';
import { SkillsComponent } from './skills/skills.component';

@NgModule({
    imports     : [ CommonModule, JuiModule, FormsModule, ReactiveFormsModule, MatButtonModule ],
    declarations: [ SheetComponent, AttributesComponent, SkillsComponent ],
    exports     : [ SheetComponent, AttributesComponent, SkillsComponent ]
})
export class SheetModule {
}
